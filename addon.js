var defaultMessage = "Hi [NAME], this is Jason from the TP Vision team. Please use the link below to submit photo documentation for your insurance inspection.  For your reference, your Customer ID is #[CUSTOMER ID].<br/><br/> \
Please click on the following link to download our photo documentation app:<br/><br/> \
https://vision.app.link/sample<br/><br/> \
This link will expire in 5 days. Once the app is downloaded, please follow the onscreen instructions to upload your photos.<br/><br/> \
[CUSTOM MESSAGE]<br/><br/> \
Thank you, and please call us at (800) 867-5309 with any questions.";

var defaultPhotoList = ["Signage", "Front of Business", "Licensure", "Documentation", "Business Equipment"];

function init() {
  populateMessage();
  populateDefaultPhotoList();
}

function populateMessage() {
  var x = document.getElementById("message");
  var fullname = document.getElementById("fullname").value;
  var customerId = document.getElementById("customerId").value;
  var customMessage = document.getElementById("customMessage") ? document.getElementById("customMessage").value : "";

  var message = defaultMessage;

  if (fullname !== '')
    message = message.replace("[NAME]", fullname);

  if (customerId !== '')
    message = message.replace("[CUSTOMER ID]", customerId);

  if (customMessage)
    message = message.replace("[CUSTOM MESSAGE]", getCustomMessageTextarea(customMessage));
  else
    message = message.replace("[CUSTOM MESSAGE]", getCustomMessageTextarea(''));

  x.innerHTML = message;
}

function populateDefaultPhotoList() {
  if (defaultPhotoList.length)
    defaultPhotoList.forEach(function (item) {
      addListItem(item);
    });
  else
    addListItem('');
}

function getCustomMessageTextarea(value) {
  var html = '<textarea name="custom_message" id="customMessage" placeholder="Enter custom message (optional)">[VALUE]</textarea>';

  return html.replace("[VALUE]", value);
}

function validate() {
  var fullname = document.getElementById("fullname");
  var customerId = document.getElementById("customerId");
  var phone = document.getElementById("phone");
  var valid = true;


  if (fullname.value == '') {
    fullname.classList.add("required");
    document.getElementById("fullnameError").classList.add("show");
    valid = false;
  } else {
    fullname.classList.remove("required");
    document.getElementById("fullnameError").classList.remove("show");
  }

  if (customerId.value == '') {
    customerId.classList.add("required");
    document.getElementById("customerIdError").classList.add("show");
    valid = false;
  } else {
    customerId.classList.remove("required");
    document.getElementById("customerIdError").classList.remove("show");
  }

  if (phone.value == '') {
    phone.classList.add("required");
    document.getElementById("phoneError").classList.add("show");
    valid = false;
  } else {
    phone.classList.remove("required");
    document.getElementById("phoneError").classList.remove("show");
  }

  return valid;
}

function createSr() {
  if (validate()) {
    var gwClient = GW.createClient("truepic", "tpvision");
    gwClient.getClient().then(function (client) {
      return Promise.all([client, client.getContext()]);
    }).then(function (values) {
      var serviceableId = document.getElementById("serviceableId").value;

      var serviceRequest = {
        "referenceNumber": Math.floor(Math.random() * 10000),
        "serviceableId": serviceableId,
        "referenceId1": Math.floor(Math.random() * 10000)
      }
      return Promise.all([values[0], values[0].invokeWithoutRefresh("createService", serviceRequest)])
    }).then(function (values) {
      values[0].navigate("servicerequest", values[1].referenceNumber);
    });
  }
}

function selectServicable(serviceableId) {
  var gwClient = GW.createClient("truepic", "tpvision");
  gwClient.getClient().then(function (client) {
    return Promise.all([client, client.getContext()]);
  }).then(function (values) {
    var serviceableId = document.getElementById("serviceableId").value;
    return values[0].httpRequest("GET", "/v1/api/prefill/serviceable/" + serviceableId);
  }).then(function (response) {
    return response.json();
  }).then(function (resp) {
    document.getElementById("fullname").value = resp.contactName;
    document.getElementById("phone").value = resp.contactPhone;
    document.getElementById("address").value = resp.contactAddress;
    document.getElementById("customerId").value = resp.claimNumber;

    document.getElementById('intake-form').style.display = 'block';
    populateMessage();
  });
}

var gwClient = GW.createClient("truepic", "tpvision");
gwClient.getClient().then(function (client) {
  return Promise.all([client, client.getContext()]);
}).then(function (values) {
  candidates = values[1].candidates;

  populateServiceables(candidates);
})

function populateServiceables(serviceables) {
  var x = document.getElementById("serviceableId");

  for (var i = 0; i < serviceables.length; i++) {
    serviceable = serviceables[i];
    var option = document.createElement("option");
    option.value = serviceable.id;
    option.text = serviceable.type + " - " + serviceable.displayableName;
    x.add(option);
  }
}

function addListItem(val) {
  var x = document.getElementById("items");

  var item = '<div class="item"> \
        <input type="text" placeholder="Enter Item" value="' + val + '" /> <a href="javascript:;" class="delItem" onclick="deleteListItem(this)">remove</a> \
      </div>';

  var newNode = document.createElement('div');
  newNode.innerHTML = item;

  x.appendChild(newNode);
}

function deleteListItem(item) {
  item.parentNode.parentNode.removeChild(item.parentNode);
}

function togglePhotoList(checked) {
  var x = document.getElementById("photolist-container");

  if (checked)
    x.style.display = 'block';
  else
    x.style.display = 'none';
}

function createServiceRequest() {
  const Http = new XMLHttpRequest();
  const url = 'https://jsonplaceholder.typicode.com/posts';
  Http.open("GET", url);
  Http.send();

  Http.onreadystatechange = (e) => {
    console.log(Http.responseText)
  }
}