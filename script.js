/* =========================================================
   ECOCYCLE
   Waste Selling Marketplace - Frontend Prototype
   ========================================================= */


/* ================= DATA ================= */

const wasteData = {

    rural: {

        title: "Rural Waste",

        icon: "🌾",

        description:
            "Turn agricultural and rural waste into value.",

        types: [

            {
                id: "rural-dry",
                name: "Dry Waste",
                icon: "🌾",
                description:
                    "Crop residues, packaging and recyclable dry materials.",
                price: 8
            },

            {
                id: "rural-wet",
                name: "Wet Waste",
                icon: "🍃",
                description:
                    "Organic waste, food waste and biodegradable materials.",
                price: 4
            }

        ]

    },


    urban: {

        title: "Urban Waste",

        icon: "🏙️",

        description:
            "Choose the type of city waste you want to sell.",

        types: [

            {
                id: "medicine",
                name: "Medicine",
                icon: "💊",
                description:
                    "Expired or unused medicines for responsible disposal.",
                price: 5
            },

            {
                id: "metal",
                name: "Metal",
                icon: "🔩",
                description:
                    "Aluminium, steel, iron and other recyclable metals.",
                price: 45
            },

            {
                id: "plastic",
                name: "Plastic",
                icon: "🧴",
                description:
                    "Bottles, containers and other recyclable plastics.",
                price: 25
            },

            {
                id: "wood",
                name: "Wood",
                icon: "🪵",
                description:
                    "Scrap wood, furniture waste and wooden materials.",
                price: 12
            },

            {
                id: "automobile",
                name: "Automobile",
                icon: "🚗",
                description:
                    "Vehicle parts, scrap components and automobile waste.",
                price: 35
            },

            {
                id: "paper",
                name: "Paper",
                icon: "📄",
                description:
                    "Newspapers, cardboard, books and paper waste.",
                price: 15
            },

            {
                id: "household",
                name: "Household",
                icon: "🏠",
                description:
                    "Separate your household waste into dry or wet waste.",
                special: true
            }

        ]

    },


    industrial: {

        title: "Industrial Waste",

        icon: "🏭",

        description:
            "Bulk waste solutions for companies and industries.",

        types: [

            {
                id: "industrial-metal",
                name: "Metal Scrap",
                icon: "⚙️",
                description:
                    "Large quantities of industrial metal scrap.",
                price: 52
            },

            {
                id: "industrial-plastic",
                name: "Plastic Scrap",
                icon: "🧱",
                description:
                    "Industrial plastic waste and manufacturing scrap.",
                price: 30
            },

            {
                id: "industrial-paper",
                name: "Paper & Cardboard",
                icon: "📦",
                description:
                    "Bulk packaging, cardboard and paper waste.",
                price: 18
            },

            {
                id: "industrial-chemical",
                name: "Industrial Chemical Waste",
                icon: "🧪",
                description:
                    "Special industrial waste requiring regulated handling.",
                price: 20
            },

            {
                id: "industrial-electronic",
                name: "E-Waste",
                icon: "💻",
                description:
                    "Electronic components and equipment scrap.",
                price: 65
            },

            {
                id: "industrial-textile",
                name: "Textile Waste",
                icon: "🧵",
                description:
                    "Fabric scraps and textile manufacturing waste.",
                price: 22
            }

        ]

    }

};


/* ================= STATE ================= */

let currentCategory = null;

let currentWaste = null;

let currentPrice = 0;


/* ================= STORAGE ================= */

function getListings() {

    return JSON.parse(
        localStorage.getItem("ecoListings") || "[]"
    );

}


function saveListings(listings) {

    localStorage.setItem(
        "ecoListings",
        JSON.stringify(listings)
    );

}


function getPoints() {

    return Number(
        localStorage.getItem("ecoPoints") || 0
    );

}


function savePoints(points) {

    localStorage.setItem(
        "ecoPoints",
        points
    );

}


/* ================= SCREEN CONTROL ================= */

function showScreen(screenId) {

    document.querySelectorAll(".screen")
        .forEach(screen => {
            screen.classList.remove("active");
        });


    document.getElementById(screenId)
        .classList.add("active");


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


function goHome() {

    showScreen("homeScreen");

}


function openCategory(category) {

    currentCategory = category;

    const data = wasteData[category];


    document.getElementById(
        "categoryHeaderIcon"
    ).textContent = data.icon;


    document.getElementById(
        "categoryEyebrow"
    ).textContent = data.title.toUpperCase();


    document.getElementById(
        "categoryTitle"
    ).textContent = "Select your waste";


    document.getElementById(
        "categoryDescription"
    ).textContent = data.description;


    renderWasteOptions(data.types);


    showScreen("categoryScreen");

}


/* ================= WASTE OPTIONS ================= */

function renderWasteOptions(types) {

    const container =
        document.getElementById("wasteOptions");


    container.innerHTML = "";


    types.forEach(type => {

        const button =
            document.createElement("button");


        button.className = "waste-option";


        button.innerHTML = `

            <span class="option-icon">
                ${type.icon}
            </span>

            <h3>
                ${type.name}
            </h3>

            <p>
                ${type.description}
            </p>

            ${
                type.special
                ?
                `<span class="price-tag">
                    Choose waste type →
                </span>`
                :
                `<span class="price-tag">
                    From ₹${type.price}/kg
                </span>`
            }

        `;


        button.onclick = () => {

            if (type.special) {

                openHousehold();

            } else {

                openSell(type);

            }

        };


        container.appendChild(button);

    });

}


/* ================= HOUSEHOLD ================= */

function openHousehold() {

    document.getElementById(
        "categoryHeaderIcon"
    ).textContent = "🏠";


    document.getElementById(
        "categoryEyebrow"
    ).textContent = "HOUSEHOLD WASTE";


    document.getElementById(
        "categoryTitle"
    ).textContent = "Dry or wet?";


    document.getElementById(
        "categoryDescription"
    ).textContent =
        "Separate your household waste before selling it.";


    renderWasteOptions([

        {
            id: "household-dry",
            name: "Dry Waste",
            icon: "📦",
            description:
                "Paper, plastic packaging, bottles and other dry waste.",
            price: 12
        },

        {
            id: "household-wet",
            name: "Wet Waste",
            icon: "🥬",
            description:
                "Food scraps, kitchen waste and biodegradable waste.",
            price: 4
        }

    ]);


    showScreen("categoryScreen");

}


/* ================= SELL ================= */

function openSell(waste) {

    currentWaste = waste;

    currentPrice = waste.price;


    document.getElementById(
        "sellIcon"
    ).textContent = waste.icon;


    document.getElementById(
        "sellTitle"
    ).textContent = waste.name;


    document.getElementById(
        "estimateWaste"
    ).textContent = waste.name;


    document.getElementById(
        "weight"
    ).value = "";


    document.getElementById(
        "notes"
    ).value = "";


    updateEstimate();


    showScreen("sellScreen");

}


/* ================= ESTIMATE ================= */

function updateEstimate() {

    const weight =
        Number(
            document.getElementById("weight").value
        ) || 0;


    const money =
        weight * currentPrice;


    const points =
        Math.floor(weight * 10);


    document.getElementById(
        "estimate"
    ).textContent =
        Math.round(money);


    document.getElementById(
        "estimateWeight"
    ).textContent =
        `${weight.toFixed(1)} kg`;


    document.getElementById(
        "estimatePoints"
    ).textContent =
        `+${points} 🌱`;

}


document.getElementById("weight")
    .addEventListener(
        "input",
        updateEstimate
    );


/* ================= FORM ================= */

document.getElementById("sellForm")
    .addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const weight =
                Number(
                    document.getElementById("weight").value
                );


            if (!weight || weight <= 0) {

                showToast(
                    "Please enter a valid waste weight."
                );

                return;

            }


            const money =
                Math.round(
                    weight * currentPrice
                );


            const points =
                Math.floor(weight * 10);


            /*
                Nature rating algorithm

                More waste recycled = higher score,
                but capped at 5.
            */

            let rating = 3.5;


            if (weight >= 2) rating = 4;

            if (weight >= 5) rating = 4.5;

            if (weight >= 10) rating = 5;


            const listing = {

                id: Date.now(),

                waste:
                    currentWaste.name,

                icon:
                    currentWaste.icon,

                weight:
                    weight,

                money:
                    money,

                points:
                    points,

                rating:
                    rating,

                date:
                    new Date().toLocaleDateString(
                        "en-IN",
                        {
                            day: "numeric",
                            month: "short",
                            year: "numeric"
                        }
                    )

            };


            const listings =
                getListings();


            listings.unshift(listing);


            saveListings(listings);


            savePoints(
                getPoints() + points
            );


            showResult(
                money,
                points,
                rating
            );

        }
    );


/* ================= RESULT ================= */

function showResult(
    money,
    points,
    rating
) {

    document.getElementById(
        "resultMoney"
    ).textContent = money;


    document.getElementById(
        "resultPoints"
    ).textContent = points;


    document.getElementById(
        "resultRating"
    ).textContent = rating;


    let coupon =
        "₹50 Food Coupon";


    if (points >= 100) {

        coupon =
            "₹50 Food Coupon";

    }


    if (points >= 200) {

        coupon =
            "₹100 Shopping Coupon";

    }


    document.getElementById(
        "couponName"
    ).textContent = coupon;


    showScreen("resultScreen");


    showToast(
        "Waste successfully listed!"
    );

}


/* ================= BACK ================= */

function backToCategory() {

    openCategory(
        currentCategory
    );

}


/* ================= DASHBOARD ================= */

function showDashboard() {

    updateDashboard();

    showScreen("dashboardScreen");

}


function updateDashboard() {

    const listings =
        getListings();


    const totalWaste =
        listings.reduce(
            (sum, item) =>
                sum + Number(item.weight),
            0
        );


    const totalEarned =
        listings.reduce(
            (sum, item) =>
                sum + Number(item.money),
            0
        );


    const totalPoints =
        getPoints();


    let averageRating = 0;


    if (listings.length > 0) {

        const ratingTotal =
            listings.reduce(
                (sum, item) =>
                    sum + Number(item.rating),
                0
            );


        averageRating =
            ratingTotal /
            listings.length;


        averageRating =
            averageRating.toFixed(1);

    }


    document.getElementById(
        "totalWaste"
    ).textContent =
        totalWaste.toFixed(1);


    document.getElementById(
        "totalEarned"
    ).textContent =
        totalEarned;


    document.getElementById(
        "totalPoints"
    ).textContent =
        totalPoints;


    document.getElementById(
        "averageRating"
    ).textContent =
        averageRating;


    renderHistory(listings);

}


/* ================= HISTORY ================= */

function renderHistory(listings) {

    const container =
        document.getElementById(
            "historyList"
        );


    if (!listings.length) {

        container.innerHTML = `

            <div class="empty-state">

                <span>🌱</span>

                <p>
                    No waste sold yet.
                </p>

            </div>

        `;

        return;

    }


    container.innerHTML = "";


    listings.slice(0, 8)
        .forEach(item => {

            const row =
                document.createElement("div");


            row.className =
                "history-item";


            row.innerHTML = `

                <div class="history-icon">
                    ${item.icon}
                </div>

                <div class="history-info">

                    <strong>
                        ${item.waste}
                    </strong>

                    <small>
                        ${item.weight} kg ·
                        ${item.date} ·
                        ⭐ ${item.rating}/5
                    </small>

                </div>

                <div class="history-money">
                    +₹${item.money}
                </div>

            `;


            container.appendChild(row);

        });

}


/* ================= REWARDS ================= */

function showRewards() {

    document.getElementById(
        "rewardPoints"
    ).textContent =
        getPoints();


    showScreen("rewardsScreen");

}


function redeemReward(
    requiredPoints,
    rewardName
) {

    const points =
        getPoints();


    if (points < requiredPoints) {

        showToast(
            `You need ${requiredPoints - points} more points.`
        );

        return;

    }


    savePoints(
        points - requiredPoints
    );


    showRewards();


    showToast(
        `${rewardName} redeemed successfully!`
    );

}


/* ================= TOAST ================= */

let toastTimer;


function showToast(message) {

    const toast =
        document.getElementById("toast");


    document.getElementById(
        "toastMessage"
    ).textContent = message;


    toast.classList.add("show");


    clearTimeout(toastTimer);


    toastTimer =
        setTimeout(() => {

            toast.classList.remove("show");

        }, 3000);

}


/* ================= INITIALIZE ================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        updateDashboard();

    }
);
