var web3;
var account;
var wall;
var web3Started = false;
var viewAgreementCounter = 0;
var collectionID;
var ag = {
  aDate: "",
  aAgreement: "",
  aPhoto: "",
  aOtherData: ""
};
var ABI = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor"
  },
  {
    inputs: [],
    name: "OutOfRange",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    name: "agreementCounters",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    name: "collections",
    outputs: [
      {
        internalType: "string",
        name: "aDate",
        type: "string"
      },
      {
        internalType: "string",
        name: "aStatement",
        type: "string"
      },
      {
        internalType: "string",
        name: "aPhotos",
        type: "string"
      },
      {
        internalType: "string",
        name: "aOtherData",
        type: "string"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "createCollection",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_collectionID",
        type: "uint256"
      },
      {
        internalType: "string",
        name: "_date",
        type: "string"
      },
      {
        internalType: "string",
        name: "_statement",
        type: "string"
      },
      {
        internalType: "string",
        name: "_photos",
        type: "string"
      },
      {
        internalType: "string",
        name: "_otherData",
        type: "string"
      }
    ],
    name: "signAgreement",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_collectionID",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "_index",
        type: "uint256"
      }
    ],
    name: "viewAgreement",
    outputs: [
      {
        components: [
          {
            internalType: "string",
            name: "aDate",
            type: "string"
          },
          {
            internalType: "string",
            name: "aStatement",
            type: "string"
          },
          {
            internalType: "string",
            name: "aPhotos",
            type: "string"
          },
          {
            internalType: "string",
            name: "aOtherData",
            type: "string"
          }
        ],
        internalType: "struct Wall.SAgreement",
        name: "",
        type: "tuple"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "viewCollectionID",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  }
];

var Address = "0x362bAF482817c8C071738D9bf339c55D046749a3";

async function demoCreate() {
  try {
    collectionID = await createCollection();
    document.getElementById("collectionid").value = collectionID;
    alert("collection created!");
  } catch (err) {
    alert("Error", err);
  }
}

// Create a new collection
const createCollection = async () => {
  if (!web3Started) {
    await startWeb3();
  }

  // Request access
  let accounts = await ethereum.send("eth_requestAccounts");
  console.log("Retrieved accounts:", accounts);

  account = accounts.result[0];

  // Create collection
  try {
    await wall.methods.createCollection().send({ from: account, gas: 200000 });
    let id = await wall.methods.viewCollectionID().call();
    console.log("Collection created:", id);
    return id;
  } catch (error) {
    console.log("Error:", error);
    throw error;
  }
};

async function demoSign() {
  // Get collection ID, agreement, photo URLs and other data. Add date.
  collectionID = document.getElementById("collectionid").value;
  console.log("Collection ID:", collectionID);

  ag.aAgreement = document.getElementById("agreement").value;
  console.log("Agreement:", ag.aAgreement);

  ag.aPhoto = document.getElementById("url").value;
  console.log("Photo:", ag.aPhoto);

  ag.aOtherData = document.getElementById("otherdata").value;
  console.log("Other Data:", ag.aOtherData);

  ag.aDate = Date();
  console.log("Date:", ag.aDate);

  try {
    await signAgreement(collectionID, ag);
  } catch (e) {
    console.log("Error", e);
  }
}

// Sign an agreement
const signAgreement = async (_id, _agreement) => {
  if (!web3Started) {
    await startWeb3();
  }

  // Request access
  let accounts = await ethereum.send("eth_requestAccounts");
  console.log("Retrieved accounts:", accounts);

  account = accounts.result[0];

  let date = _agreement.aDate;
  let agreement = _agreement.aAgreement;
  let photo = _agreement.aPhoto;
  let otherData = _agreement.aOtherData;

  // Sign agreement
  try {
    let v = await wall.methods
      .signAgreement(_id, date, agreement, photo, otherData)
      .send({ from: account, gas: 1000000 });
    console.log("Agreement signed by", account);
    alert("Agreement signed!");
    return v.transactionHash;
  } catch (error) {
    console.log("Error:", error);
    alert("Error", error);
  }
};

// View the next agreement on the blockchain
async function viewNextAgreement() {
  let collectionID = document.getElementById("collectionid").value;
  console.log("Collection ID:", collectionID);

  viewAgreementCounter += 1;
  console.log("viewAgreementCounter:", viewAgreementCounter);

  ag = await viewAgreement(collectionID, viewAgreementCounter);

  // Display agreement
  document.getElementById("viewDate").value = ag.aDate;
  document.getElementById("viewAgreement").value = ag.aAgreement;
  document.getElementById("viewUrl").value = ag.aPhoto;
  document.getElementById("viewOtherData").value = ag.aOtherData;
}

// View the previous agreement on the blockchain
async function viewPreviousAgreement() {
  let collectionID = document.getElementById("collectionid").value;
  console.log("Collection ID:", collectionID);

  if (viewAgreementCounter > 0) {
    viewAgreementCounter -= 1;
  }
  console.log("viewAgreementCounter:", viewAgreementCounter);

  ag = await viewAgreement(collectionID, viewAgreementCounter);

  // Display agreement
  document.getElementById("viewDate").value = ag.aDate;
  document.getElementById("viewAgreement").value = ag.aAgreement;
  document.getElementById("viewUrl").value = ag.aPhoto;
  document.getElementById("viewOtherData").value = ag.aOtherData;
}

// Retrieve agreement from the blockchain
const viewAgreement = async (_id, _index) => {
  if (!web3Started) {
    await startWeb3();
  }

  // Request access
  let accounts = await ethereum.send("eth_requestAccounts");
  console.log("Retrieved accounts:", accounts);

  account = accounts.result[0];

  try {
    let rvalue = await wall.methods.viewAgreement(_id, _index).call();
    console.log("Agreement:", rvalue);

    let agreement = {
      aDate: rvalue[0],
      aAgreement: rvalue[1],
      aPhoto: rvalue[2],
      aOtherData: rvalue[3]
    };

    return agreement;
  } catch (error) {
    console.log("Error :", error);
    alert("Error", error);
  }
};

const startWeb3 = async () => {
  if (typeof window.ethereum !== "undefined") {
    console.log("Metamask is installed!");

    // Create Web3 instance
    web3 = new Web3(window.ethereum);
    console.log("Web3 instance created:", web3);

    try {
      // Create Wall instance
      wall = new web3.eth.Contract(ABI, Address);
      console.log("Wall:", wall);

      web3Started = true;
    } catch (error) {
      // User denied account access
      console.log("Error:", error);
    }
  } else {
    console.log("Metamask is not installed!");
  }
};

export { signAgreement, viewAgreement };
