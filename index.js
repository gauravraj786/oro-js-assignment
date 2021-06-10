window.onload = () => {
    let data = [
        {
            partner_name: "Jayaram S",
            contact_number: "990009902",
            id: "OM00007",
            locations: [
                {
                    lat: 13.0376,
                    long: 80.1446,
                    time: "01: 35 PM",
                    place_name: "Sri Ramachandra Hospital"
                },
                {
                    lat: 13.0758,
                    long: 80.2273,
                    time: "02: 35 PM",
                    place_name: "Billroth Hospitals"
                },
                {
                    lat: 13.0741,
                    long: 80.2357,
                    time: "03: 35 PM",
                    place_name: "Joseph Hospitals"
                },
                {
                    lat: 13.0553,
                    long: 80.2649,
                    time: "04: 35 PM",
                    place_name: "Government Royapettah Hospital"
                }
            ],
            status: "VISIT"
        },
        {
            partner_name: "Kannan S",
            contact_number: "990009900",
            id: "OM00005",
            locations: [
                {
                    lat: 13.0376,
                    long: 80.1446,
                    time: "01: 35 PM",
                    place_name: "Sri Ramachandra Hospital"
                },
                {


                    lat: 13.0758,
                    long: 80.2273,
                    time: "02: 35 PM",
                    place_name: "Billroth Hospitals"
                },
                {
                    lat: 13.0741,
                    long: 80.2357,
                    time: "03: 35 PM",
                    place_name: "Joseph Hospitals"
                }
            ],
            status: "IDLE"
        },
        {
            partner_name: "Sivasubramaniyan K",
            contact_number: "990009901",
            id: "OM00006",
            locations: [
                {
                    lat: 13.0376,
                    long: 80.1446,
                    time: "01: 35 PM",
                    place_name: "Sri Ramachandra Hospital"
                },
                {
                    lat: 13.0758,
                    long: 80.2273,
                    time: "02: 35 PM",
                    place_name: "Billroth Hospitals"
                },
            ],
            status: "INACTIVE"
        }

    ]
    initSidePanel(data);
}
const initMap = (data) => {
    let bound = new google.maps.LatLngBounds();
    let locations = data.locations;
    let paths = []
    for (let index = 0; index < locations.length; index++) {
        paths.push(new google.maps.LatLng(locations[index].lat, locations[index].long))
        bound.extend(new google.maps.LatLng(locations[index].lat, locations[index].long));
    }
    document.getElementById("map").innerHTML = ""

    let mapcenter = bound.getCenter()
    const map = new google.maps.Map(document.getElementById("map"), {
        center: mapcenter,
        zoom: window.screen.availWidth <= 768 ? 11.7 : 13,
    });

    for (let index = 0; index < locations.length; index++) {
        bound.extend(new google.maps.LatLng(locations[index].lat, locations[index].long));
        let marker = new google.maps.Marker({
            position: {
                lat: locations[index].lat,
                lng: locations[index].long
            },

            map: map,
            icon: {
                anchor: new google.maps.Point(23, 62),
                url: `data:image/svg+xml;utf-8,
                <svg class="shadow" width="48" height="67" stroke="black" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0px 0px 2px rgba(0, 0, 0, 0.4));padding:3px;">
<g >
    <rect   x="0" y="0" width="42" height="42" style="fill:rgb(244, 202, 53)" stroke="rgb(244, 202, 53)" />
    <circle cx="21" cy="22" r="12" stroke="rgb(252 243 215)" stroke-width="1" fill="rgb(252 243 215)" />
    <text x="16" y="27" font-family="Verdana" font-size="15" fill="black">${index + 1}</text>
</g>
<g>
    <path   d="M 16 0 L 0 0 L 8 11 L 16 0" style="fill:rgb(244, 202, 53)"  stroke="rgb(244, 202, 53)" transform="translate(13 42)"></path>
    <circle cx="21" cy="58" r="4" stroke="black" stroke-width="1" fill="black" />
</g>
</svg> `
            },
            title: locations[index].place_name
        });
    }

    let line = new google.maps.Polyline({
        path: [
            ...paths
        ],
        strokeColor: "black",
        strokeOpacity: 1.0,
        strokeWeight: 2,
        map: map
    });


}

const initSidePanel = (data, activeRecordId) => {
    let sidePanel = document.querySelector(".side-panel")
    let activeRecord = null
    data.map((record, rIndex) => {

        let card = document.createElement("div");
        card.classList.add("card");
        card.addEventListener("click", () => selectHandler(record, card))

        let name = document.createElement("div");
        name.classList.add("partner-name");
        name.appendChild(document.createTextNode(record.partner_name))

        let metaData = document.createElement("div");
        metaData.classList.add("meta-data");
        metaData.appendChild(document.createTextNode(record.id))
        metaData.appendChild(document.createTextNode("|"))
        metaData.appendChild(document.createTextNode(record.contact_number))

        let status = document.createElement("div");
        status.classList.add("status");

        let circle = document.createElement("span");
        circle.classList.add("circle");
        circle.setAttribute("status", record.status);
        status.appendChild(circle);
        status.appendChild(document.createTextNode(record.status))

        card.appendChild(name)
        card.appendChild(metaData)
        card.appendChild(status)

        sidePanel.appendChild(card)
        if (activeRecordId && record.id == activeRecordId) {
            activeRecord = record

        }
        if (!activeRecordId && rIndex == 0) {
            activeRecord = record
            activeRecord.card = card
        }
    })
    if (activeRecord) {
        selectHandler(activeRecord, activeRecord.card)
    }
    let toggleSettings = document.querySelector(".toggle-settings");
    let toggleSidePanel = document.querySelector(".toggle-side-panel");
    if (toggleSettings && toggleSidePanel) {
        toggleSettings.addEventListener("click", () => toggleHandler(document.querySelector(".settings-panel")))
        toggleSidePanel.addEventListener("click", () => toggleHandler(document.querySelector(".side-panel")))
    }
}

const selectHandler = (record, card) => {
    let activeCard = document.querySelector(".side-panel").querySelector(".active");
    if (activeCard) {
        activeCard.classList.remove("active")
    }
    card.classList.add("active");
    if(document.querySelector(".side-panel") && document.querySelector(".side-panel").classList.contains("expanded")){
        toggleHandler(document.querySelector(".side-panel"))
    }
    
    // Overivew construction
    let overview = document.querySelector(".overview")
    overview.innerHTML = "";

    let nameCell = document.createElement("div")
    nameCell.classList.add("cell");
    nameCell.appendChild(document.createTextNode("NAME"))
    let name = document.createElement("div");
    name.classList.add("text-bold")
    name.appendChild(document.createTextNode(record.partner_name))
    nameCell.appendChild(name)

    let idCell = document.createElement("div")
    idCell.classList.add("cell");
    idCell.appendChild(document.createTextNode("PARTNER ID"))
    let id = document.createElement("div");
    id.classList.add("text-bold")
    id.appendChild(document.createTextNode(record.id))
    idCell.appendChild(id)

    let contantCell = document.createElement("div")
    contantCell.classList.add("cell");
    contantCell.appendChild(document.createTextNode("MOBILE NUMBER"))
    let num = document.createElement("div");
    num.classList.add("text-bold");
    num.appendChild(document.createTextNode(record.contact_number));
    contantCell.appendChild(num);

    let statusCell = document.createElement("div")
    statusCell.classList.add("cell");
    statusCell.appendChild(document.createTextNode("STATUS"))
    let status = document.createElement("div");
    status.classList.add("text-bold");
    let span = document.createElement("span");
    span.classList.add("status-span")
    span.setAttribute("status", record.status)
    status.appendChild(span)
    status.appendChild(document.createTextNode(record.status));
    statusCell.appendChild(status);

    let contactCell = document.createElement("div")
    contactCell.classList.add("cell");
    contactCell.classList.add("contact-number");

    let textDiv = document.createElement("div");
    textDiv.classList.add("text-bold");
    textDiv.appendChild(document.createTextNode("Call Partner"));
    contactCell.appendChild(textDiv);

    overview.appendChild(nameCell);
    overview.appendChild(idCell);
    overview.appendChild(contantCell);
    overview.appendChild(statusCell);
    overview.appendChild(contactCell);

    // Map construction
    initMap(record);

    //Location construction
    let locationsDiv = document.querySelector(".locations");
    locationsDiv.innerHTML = ""
    record.locations.map((lrecord, index) => {
        let card = document.createElement("div");
        card.classList.add("card");

        let stopCell = document.createElement("div")
        stopCell.classList.add("cell");
        stopCell.appendChild(document.createTextNode("STOP NO."))
        let num = document.createElement("div");
        num.classList.add("text-bold");
        num.appendChild(document.createTextNode(index + 1));
        stopCell.appendChild(num);

        let latCell = document.createElement("div")
        latCell.classList.add("cell");
        latCell.appendChild(document.createTextNode("LAT"))
        num = document.createElement("div");
        num.classList.add("text-bold");
        num.appendChild(document.createTextNode(lrecord.lat));
        latCell.appendChild(num);

        let logCell = document.createElement("div")
        logCell.classList.add("cell");
        logCell.appendChild(document.createTextNode("LONG"))
        num = document.createElement("div");
        num.classList.add("text-bold");
        num.appendChild(document.createTextNode(lrecord.long));
        logCell.appendChild(num);

        let timeCell = document.createElement("div")
        timeCell.classList.add("cell");
        timeCell.appendChild(document.createTextNode("TIME"))
        num = document.createElement("div");
        num.classList.add("text-bold");
        num.appendChild(document.createTextNode(lrecord.time));
        timeCell.appendChild(num);

        card.appendChild(stopCell);
        card.appendChild(latCell);
        card.appendChild(logCell);
        card.appendChild(timeCell);

        locationsDiv.appendChild(card);
    })


}

const toggleHandler = (element) => {
    if (element && element.classList.contains("expanded")) {
        element.classList.remove("expanded");
        element.classList.add("close");
    } else if (element) {
        element.classList.remove("close");
        element.classList.add("expanded");
    }
}