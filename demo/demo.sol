// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IIPFS {
    function uploadFile(bytes memory fileData) external returns (string memory);
}

contract HealthcareSystem {
    address public owner;
    IIPFS public ipfsContract; 

    struct Patient {
        string name;
        uint256 age;
        string gender;
        string ipfsHash; // Store IPFS hash of medical records
        mapping(address => bool) authorizedProviders;
        bool isRegistered; // New: Check if patient exists
    }

    mapping(address => Patient) private patients;
    mapping(address => bool) private registeredPatients;

    // Events
    event PatientRegistered(address indexed patientAddress, string name);
    event MedicalHistoryUpdated(address indexed patientAddress, string newHistory);
    event ProviderAuthorized(address indexed patientAddress, address providerAddress);
    event ProviderRevoked(address indexed patientAddress, address providerAddress);
    event DebugAccess(address caller, bool isAuthorized, bool isOwner, bool isRegistered); // Debugging

    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }

    modifier onlyOwnerOrProvider(address patientAddress) {
        require(
            msg.sender == owner || patients[patientAddress].authorizedProviders[msg.sender],
            "Not authorized"
        );
        _;
    }

    modifier onlyPatient(address patientAddress) {
        require(msg.sender == patientAddress, "Only the patient can perform this action");
        _;
    }

    constructor(address _ipfsContractAddress) {
        owner = msg.sender;
        ipfsContract = IIPFS(_ipfsContractAddress);
    }

    // Register a new patient
    function registerPatient(
        address patientAddress,
        string memory name,
        uint256 age,
        string memory gender
    ) public {
        require(!registeredPatients[patientAddress], "Patient already registered");
        require(bytes(name).length > 0, "Name cannot be empty");
        require(age > 0, "Age must be greater than 0");

        registeredPatients[patientAddress] = true;
        patients[patientAddress].name = name;
        patients[patientAddress].age = age;
        patients[patientAddress].gender = gender;
        patients[patientAddress].isRegistered = true; // Set registration flag

        emit PatientRegistered(patientAddress, name);
    }

    // Update patient medical history (Store on IPFS)
    function updateMedicalHistory(address patientAddress, string memory newHistory)
        public
        onlyOwnerOrProvider(patientAddress)
    {
        require(patients[patientAddress].isRegistered, "Patient not registered");

        string memory ipfsHash = ipfsContract.uploadFile(bytes(newHistory));
        patients[patientAddress].ipfsHash = ipfsHash;
        emit MedicalHistoryUpdated(patientAddress, ipfsHash); 
    }

    // Authorize a healthcare provider
    function authorizeProvider(address patientAddress, address providerAddress)
        public
        onlyPatient(patientAddress)
    {
        require(patients[patientAddress].isRegistered, "Patient not registered");
        
        patients[patientAddress].authorizedProviders[providerAddress] = true;
        emit ProviderAuthorized(patientAddress, providerAddress);
    }

    // Revoke provider authorization
    function revokeProvider(address patientAddress, address providerAddress)
        public
        onlyPatient(patientAddress)
    {
        require(patients[patientAddress].isRegistered, "Patient not registered");
        
        patients[patientAddress].authorizedProviders[providerAddress] = false;
        emit ProviderRevoked(patientAddress, providerAddress);
    }
    function debugAccess(address patientAddress) public {
    bool isAuthorized = patients[patientAddress].authorizedProviders[msg.sender];
    bool isOwner = (msg.sender == owner);
    bool isRegistered = registeredPatients[patientAddress];

    emit DebugAccess(msg.sender, isAuthorized, isOwner, isRegistered);
    }


    // Get patient details (for authorized providers only)
    function getPatientDetails(address patientAddress)
        public
        view
        returns (string memory, uint256, string memory, string memory)
    {
        bool isAuthorized = patients[patientAddress].authorizedProviders[msg.sender];
        bool isOwner = msg.sender == owner;
        bool isRegistered = patients[patientAddress].isRegistered;

        require(isRegistered, "Patient not registered");
        require(isAuthorized || isOwner, "Not authorized to view details");

        Patient storage patient = patients[patientAddress];
        return (patient.name, patient.age, patient.gender, patient.ipfsHash);
    }

    // Check if provider is authorized
    function isProviderAuthorized(address patientAddress, address providerAddress)
        public
        view
        returns (bool)
    {
        return patients[patientAddress].authorizedProviders[providerAddress];
    }

    // Retrieve medical history from IPFS (for authorized providers only)
    function getMedicalHistory(address patientAddress) 
        public 
        view 
        returns (string memory) 
    {
        require(patients[patientAddress].isRegistered, "Patient not registered");
        require(
            patients[patientAddress].authorizedProviders[msg.sender] || msg.sender == owner,
            "Not authorized to view medical history"
        );
        return patients[patientAddress].ipfsHash; 
    }
}
