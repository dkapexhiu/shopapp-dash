var config = {
};
firebase.initializeApp(config);
var db = firebase.firestore();
const auth = firebase.auth();
var storage = firebase.storage();

//products crm
// Create a storage reference from our storage service
var storageRef = storage.ref();

var subida = document.getElementById("subir");
var archivo = document
  .getElementById("archivo")
  .addEventListener("change", subir);
var URL;
var file;

function subir(e) {
  file = e.target.files[0]; // use the Blob or File API
  var spaceRef = storageRef.child("images/" + file.name).put(file);
  spaceRef.on(
    "state_changed",
    function (snapshot) {
      var progreso = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      subida.style.width = progreso + "%";
    },
    function (error) {
      // Handle unsuccessful uploads
    },
    function () {
      URL = spaceRef.snapshot.downloadURL;
    }
  );
}

btnGuardar = document
  .getElementById("submit")
  .addEventListener("click", guardar);
function guardar() {
  var name = document.getElementById("name").value;
  var price = document.getElementById("price").value;
  var lighting = document.getElementById("lighting").value;
  var watering = document.getElementById("watering").value;
  var temperature = document.getElementById("temperature").value;

  const newId = Math.random().toString(36).substring(0);
  db.collection("products")
    .doc(newId)
    .set({
      name: name,
      price: price,
      thumbnail: URL,
      image: file.name,
      lighting: lighting,
      watering: watering,
      temperature: temperature,
      productId: newId
    })
    .then(function (docRef) {
      console.log("Document written with ID: ", docRef.id);
      document.getElementById("name").value = "";
      document.getElementById("price").value = "";
      document.getElementById("lighting").value = "";
      document.getElementById("watering").value = "";
      document.getElementById("temperature").value = "";
    })
    .catch(function (error) {});
}

var tabla = document.getElementById("tabla");
db.collection("products").onSnapshot((querySnapshot) => {
  tabla.innerHTML = "";
  querySnapshot.forEach((doc) => {
    tabla.innerHTML += `
        <tr>
        <td>${doc.id}</td>
        <td>${doc.data().name}</td>
        <td>${doc.data().price}</td>
        <td>${doc.data().lighting}</td>
        <td>${doc.data().watering}</td>
        <td>${doc.data().temperature}</td>
        <td><img width=10% src=${doc.data().thumbnail} alt=""></td>
        <td>
        <button onclick="borrar('${doc.id}', '${
      doc.data().name
    }')"><i class="material-icons blue-text">delete</i></button>
        </td>
        </tr>
        `;
  });
});

function borrar(id, key) {
  db.collection("products")
    .doc(id)
    .delete()
    .then(function () {
      var desertRef = storageRef.child("images/" + key);

      // Delete the file
      desertRef
        .delete()
        .then(function () {
          //console.log("Archivo eliminator");
        })
        .catch(function (error) {
          // Uh-oh, an error occurred!
        });
    })
    .catch(function (error) {
      console.error("Error removing document: ", error);
    });
};

var subidaEdit = document.getElementById("subirEdit");
var archivoEdit = document
  .getElementById("archivoEdit")
  .addEventListener("change", subirEdit);
var URLEdit;
var fileEdit;

function subirEdit(e) {
  fileEdit = e.target.files[0]; // use the Blob or File API
  var spaceRef = storageRef.child("images/" + fileEdit.name).put(fileEdit);
  spaceRef.on(
    "state_changed",
    function (snapshot) {
      var progresoEdit = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      subidaEdit.style.width = progresoEdit + "%";
    },
    function (error) {
      // Handle unsuccessful uploads
    },
    function () {
      URLEdit = spaceRef.snapshot.downloadURL;
    }
  );
}

var btnEdit = document
  .getElementById("submitEdit")
  .addEventListener("click", edit);

function edit() {

  var idEdit = document.getElementById("idEdit").value;
  var nameEdit = document.getElementById("nameEdit").value;
  var priceEdit = document.getElementById("priceEdit").value;
  var lightingEdit = document.getElementById("lightingEdit").value;
  var wateringEdit = document.getElementById("wateringEdit").value;
  var temperatureEdit = document.getElementById("temperatureEdit").value;

  db.collection("products")
    .doc(idEdit)
    .update({
      name: nameEdit,
      price: priceEdit,
      thumbnail: URLEdit,
      image: fileEdit.name,
      lighting: lightingEdit,
      watering: wateringEdit,
      temperature: temperatureEdit,
    })
    .then(function (docRef) {
      console.log("Document written with ID: ", docRef.id);
      document.getElementById("nameEdit").value = "";
      document.getElementById("priceEdit").value = "";
      document.getElementById("lightingEdit").value = "";
      document.getElementById("wateringEdit").value = "";
      document.getElementById("temperatureEdit").value = "";
    })
    .catch(function (error) {});
}

//orders crm
var orders = document.getElementById("orders");
db.collection("orders").onSnapshot((querySnapshot) => {
  orders.innerHTML = "";
  querySnapshot.forEach((doc) => {
    //console.log(doc.data());
    var cartItems = doc.data().cartItems;
    cartItems.forEach((item) => {
      orders.innerHTML += `
            <tr>
            <td>${doc.id}</td>
            <td>${item.productId}</td>
            <td>${item.name}</td>
            <td>${item.price}</td>
            <td>${item.quantity}</td>
            <td>${doc.data().cartTotal}</td>
            <td>${doc.data().uid}</td>
            </tr>
            `;
    });
  });
});

//users crm
var users = document.getElementById("users");
db.collection("users").onSnapshot((querySnapshot) => {
  users.innerHTML = "";
  querySnapshot.forEach((doc) => {
    //console.log(doc.data());
    users.innerHTML += `
            <tr>
            <td>${doc.data().id}</td>
            <td>${doc.data().fullName}</td>
            <td>${doc.data().email}</td>
            </tr>
            `;
  });
});

//payments crm
var payments = document.getElementById("payments");
db.collection("payments").onSnapshot((querySnapshot) => {
  payments.innerHTML = "";
  querySnapshot.forEach((doc) => {
    //console.log(doc.data());
    payments.innerHTML += `
            <tr>
            <td>${doc.id}</td>
            <td>${doc.data().data.message}</td>
            <td>${doc.data().email}</td>
            <td>${doc.data().orderId}</td>
            </tr>
            `;
  });
});

//auth firebase
const loggedOutLinks = document.querySelectorAll(".logged-out");
const loggedInLinks = document.querySelectorAll(".logged-in");

const loginCheck = (user) => {
  if (user) {
    loggedInLinks.forEach((link) => (link.style.display = "block"));
    loggedOutLinks.forEach((link) => (link.style.display = "none"));
    document.getElementById("data").style.display = "block";
  } else {
    loggedInLinks.forEach((link) => (link.style.display = "none"));
    loggedOutLinks.forEach((link) => (link.style.display = "block"));
    document.getElementById("data").style.display = "none";
  }
};

const signinForm = document.querySelector("#login-form");

signinForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.querySelector("#login-email").value;
  const password = document.querySelector("#login-password").value;
  auth.signInWithEmailAndPassword(email, password).then((userCredential) => {
    //clear form
    signinForm.reset();
    //close the modal
    $("#signinModal").modal("hide");
  });
});

const logout = document.querySelector("#logout");
logout.addEventListener("click", (e) => {
  e.preventDefault();

  auth.signOut().then(() => {
    console.log("sign out");
  });
});

//Events
//List for auth state changes
auth.onAuthStateChanged((user) => {
  if (user) {
    loginCheck(user);
  } else {
    loginCheck(user);
  }
});
