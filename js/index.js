let contractInstance=null;
let client=null;
let contractAddress="ct_2cvZsjmWQNVfiJvCmU6zydeducgrQ1VAt4c5HX2Ah9DwjxrZqc";
let contractSource=`
include "List.aes"
contract RideArt =
   
  record ride =
    { customersAddress : address,
      firstname    : string,
      surname      : string,
      email       : string, 
      mobile       : int,
      currentlocation    : string,
      destination    : string
    }
      
  record state =
    { rides : map(int, ride),
      userRides       : map(address, list(ride)),
      ridesLength : int,
      admin : address }
      
  entrypoint init() =
    { rides = {},
      userRides = {},
      ridesLength = 0,
      admin = Call.caller }

  function requirement(exp : bool, err : string) =
    if(!exp)
     abort(err)

  entrypoint onlyAdmin() : bool =
    requirement(state.admin ==ak_XxhDx9Mo6MT3p1RjoD8uqsra7P22TNyWkyr9WR4NT5xtAGdap, "You are not admin to access this page")
    true

  entrypoint getRides(index : int) : ride =
    onlyAdmin()
    switch(Map.lookup(index, state.rides))
      None    => abort("There was no ride registered.")
      Some(x) => x

  entrypoint getAllRides()=
   onlyAdmin()
   state.rides

  entrypoint getUsersRide()=
   Map.lookup_default(Call.caller, state.userRides,[])
      
  stateful entrypoint registerRide(firstname' : string, surname' : string, email' : string, mobile' : int, currentlocation' : string, destination': string)=                                           
    let ride = { customersAddress = Call.caller, firstname = firstname', surname   = surname', email    = email', mobile    = mobile', currentlocation     = currentlocation', destination = destination'}
    let index = getRidesLength() + 1

    let userRidesList=Map.lookup_default(Call.caller,state.userRides,[])
    let newUserRidesList=ride::userRidesList

    put(state{ rides[index] = ride, ridesLength = index, userRides[Call.caller] = newUserRidesList })
    
  entrypoint getRidesLength() : int =
    state.ridesLength
`;

window.addEventListener('load',async function(){
    client=await Ae.Aepp();
    contractInstance=await client.getContractInstance(contractSource,{contractAddress});
    let allRides=(await contractInstance.methods.getAllRides()).decodedResult;
    console.log(allRides,"all rides");
    allRides.map(ride=>{ 
        addRideToDom(ride.firstname,ride.surname,ride.email,ride.mobile,ride.location,ride.destination);
    });
});

    async function handleSubmitBook(){
        let firstname=document.getElementById("firstname").value;
        let surname=document.getElementById("surname").value;
        let email=document.getElementById("email").value;
        let mobile=document.getElementById("mobile").value;
        let location=document.getElementById("location").value;
        let destination=document.getElementById("destination").value;
    
        if(firstname.trim()!=""&&surname.trim()!=""&&email.trim()!=""&&mobile.trim()!=""&&location.trim()!=""&&destination.trim()!=""){
           // await contractInstance.methods.registerRide(firstname,surname,email,mobile,location,destination);
            addRideToDom(firstname,surname,email,mobile,location,destination);
        }
    }
    
document.getElementById("button").addEventListener("click",handleSubmitBook);
    
function addRideToDom(firstname,surname,email,mobile,location,destination){
    let allRides=document.getElementById("book-a-ride-form");

    let newRideDiv=document.createElement("div");
    newRideDiv.classList.add("ride");

    let rideFirstNameParagraph=document.createElement("p");
    rideFirstNameParagraph.innerText=firstname;

    let rideSurnameParagraph=document.createElement("p");
    rideSurnameParagraph.innerText=surname;

    let rideEmailParagraph=document.createElement("p");
    rideEmailParagraph.innerText=email;

    let rideMobileParagraph=document.createElement("p");
    rideMobileParagraph.innerText=mobile;

    let rideLocationParagraph=document.createElement("p");
    rideLocationParagraph.innerText=location;

    let rideDestinationParagraph=document.createElement("p");
    rideDestinationParagraph.innerText=destination;

    newRideDiv.appendChild(rideFirstNameParagraph);
    newRideDiv.appendChild(rideSurnameParagraph);
    newRideDiv.appendChild(rideEmailParagraph);
    newRideDiv.appendChild(rideMobileParagraph);
    newRideDiv.appendChild(rideLocationParagraph);
    newRideDiv.appendChild(rideDestinationParagraph);
    
    console.log(allRides);
    allRides.appendChild(newRideDiv);
}
