import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Nat32 "mo:core/Nat32";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import VarArray "mo:core/VarArray";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Initialize the access control system
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  //#region User Profile Management

  public type UserProfile = {
    name : Text;
    email : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  //#endregion

  //#region Application Management

  var nextApplicationID = 1001;

  let applications = Map.empty<Nat, Application>();

  public type ApplicationStatus = {
    #pending;
    #approved;
    #rejected;
    #underReview;
    #processing;
    #completed;
  };

  public type Application = {
    id : Nat;
    name : Text;
    email : Text;
    amount : Nat;
    country : Text;
    status : ApplicationStatus;
  };

  // Public function - accessible to anyone (guests included)
  public shared ({ caller }) func createApplication(name : Text, email : Text, amount : Nat, country : Text) : async Application {
    // Validate amount is between 5000 and 50000
    if (amount < 5000 or amount > 50000) {
      Runtime.trap("Amount must be between $5,000 and $50,000");
    };

    // Validate required fields
    if (name.size() == 0 or email.size() == 0 or country.size() == 0) {
      Runtime.trap("Please provide valid data for all fields");
    };

    let newApplication : Application = {
      id = nextApplicationID;
      name;
      email;
      amount;
      country;
      status = #pending;
    };

    applications.add(nextApplicationID, newApplication);
    nextApplicationID += 1;

    newApplication;
  };

  // Public query - accessible to anyone with Application ID
  public query ({ caller }) func getApplicationStatus(applicationID : Nat) : async ?Application {
    applications.get(applicationID);
  };

  // Admin-only function
  public query ({ caller }) func getAllApplications() : async [(Nat, Application)] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only administrators can list all applications");
    };
    applications.entries().toArray();
  };

  // Admin-only function
  public shared ({ caller }) func updateApplicationStatus(applicationID : Nat, newStatus : ApplicationStatus) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only administrators can update application status");
    };

    switch (applications.get(applicationID)) {
      case (null) { Runtime.trap("Application ID not found") };
      case (?app) {
        let updatedApp : Application = { app with status = newStatus };
        applications.add(applicationID, updatedApp);
      };
    };
  };

  //#endregion

  //#region Processing Fees

  type ProcessingFee = Nat;

  let processingFees = Map.empty<Nat, ProcessingFee>();

  // Admin-only function
  public shared ({ caller }) func setProcessingFee(appId : Nat, fee : ProcessingFee) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only administrators can set processing fees");
    };
    processingFees.add(appId, fee);
  };

  // Public query - accessible to applicants checking their status
  public query ({ caller }) func getProcessingFee(appId : Nat) : async ?ProcessingFee {
    processingFees.get(appId);
  };

  // Admin-only function
  public query ({ caller }) func getAllProcessingFees() : async [(Nat, ProcessingFee)] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only administrators can list all processing fees");
    };
    processingFees.entries().toArray();
  };

  // Admin-only function
  public shared ({ caller }) func removeProcessingFee(appId : Nat) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only administrators can remove processing fees");
    };
    processingFees.remove(appId);
  };

  //#endregion

  //#region Receiving Accounts

  public type AccountType = {
    #bank;
    #crypto;
  };

  public type ReceivingAccount = {
    id : Nat;
    accountType : AccountType;
    accountName : Text;
    accountDetails : Text;
  };

  var nextAccountID = 1;
  let receivingAccounts = Map.empty<Nat, ReceivingAccount>();
  let applicationAccounts = Map.empty<Nat, Nat>(); // Maps application ID to account ID

  // Admin-only function
  public shared ({ caller }) func createReceivingAccount(accountType : AccountType, accountName : Text, accountDetails : Text) : async ReceivingAccount {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only administrators can create receiving accounts");
    };

    let newAccount : ReceivingAccount = {
      id = nextAccountID;
      accountType;
      accountName;
      accountDetails;
    };

    receivingAccounts.add(nextAccountID, newAccount);
    nextAccountID += 1;

    newAccount;
  };

  // Admin-only function
  public shared ({ caller }) func updateReceivingAccount(accountId : Nat, accountType : AccountType, accountName : Text, accountDetails : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only administrators can update receiving accounts");
    };

    switch (receivingAccounts.get(accountId)) {
      case (null) { Runtime.trap("Account ID not found") };
      case (?_) {
        let updatedAccount : ReceivingAccount = {
          id = accountId;
          accountType;
          accountName;
          accountDetails;
        };
        receivingAccounts.add(accountId, updatedAccount);
      };
    };
  };

  // Admin-only function
  public query ({ caller }) func getAllReceivingAccounts() : async [(Nat, ReceivingAccount)] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only administrators can list receiving accounts");
    };
    receivingAccounts.entries().toArray();
  };

  // Admin-only function
  public shared ({ caller }) func assignReceivingAccount(applicationId : Nat, accountId : Nat) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only administrators can assign receiving accounts");
    };

    // Verify application exists
    switch (applications.get(applicationId)) {
      case (null) { Runtime.trap("Application ID not found") };
      case (?_) {};
    };

    // Verify account exists
    switch (receivingAccounts.get(accountId)) {
      case (null) { Runtime.trap("Account ID not found") };
      case (?_) {};
    };

    applicationAccounts.add(applicationId, accountId);
  };

  // Public query - accessible to applicants checking their payment instructions
  public query ({ caller }) func getPaymentInstructions(applicationId : Nat) : async ?ReceivingAccount {
    switch (applicationAccounts.get(applicationId)) {
      case (null) { null };
      case (?accountId) { receivingAccounts.get(accountId) };
    };
  };

  //#endregion
};
