// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract HealthcareSystem {
    address public owner;

    struct Patient {
        string name;
        uint256 age;
        string gender;
        string ipfsHash; 
        mapping(address => bool) authorizedProviders;
    }

    mapping(address => Patient) private patients;
    mapping(address => bool) private registeredPatients;

    event PatientRegistered(address indexed patientAddress, string name);
    event MedicalHistoryUpdated(address indexed patientAddress, string ipfsHash);
    event ProviderAuthorized(address indexed patientAddress, address providerAddress);
    event ProviderRevoked(address indexed patientAddress, address providerAddress);

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

    constructor() {
        owner = msg.sender;
    }

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

        emit PatientRegistered(patientAddress, name);
    }

    function updateMedicalHistory(address patientAddress, string memory ipfsHash)
        public
        onlyOwnerOrProvider(patientAddress)
    {
        patients[patientAddress].ipfsHash = ipfsHash;
        emit MedicalHistoryUpdated(patientAddress, ipfsHash);
    }
    

    function authorizeProvider(address patientAddress, address providerAddress)
        public
        onlyPatient(patientAddress)
    {
        patients[patientAddress].authorizedProviders[providerAddress] = true;
        emit ProviderAuthorized(patientAddress, providerAddress);
    }

    function revokeProvider(address patientAddress, address providerAddress)
        public
        onlyPatient(patientAddress)
    {
        patients[patientAddress].authorizedProviders[providerAddress] = false;
        emit ProviderRevoked(patientAddress, providerAddress);
    }

    function getPatientDetails(address patientAddress)
        public
        view
        returns (string memory, uint256, string memory, string memory)
    {
        require(
            msg.sender == patientAddress || msg.sender == owner|| patients[patientAddress].authorizedProviders[msg.sender],
            "Not authorized to view details"
        );

        Patient storage patient = patients[patientAddress];
        return (patient.name, patient.age, patient.gender, patient.ipfsHash);
    }


    function getMedicalHistory(address patientAddress) 
        public 
        view 
        returns (string memory) 
    {
        require(
            patients[patientAddress].authorizedProviders[msg.sender] || msg.sender == owner,
            "Not authorized to view medical history"
        );
        return patients[patientAddress].ipfsHash;
    }
}
