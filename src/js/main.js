let headerTitleLink;
let headerTitle;
let headerLocationInfo;
let mainMenu;
let footer;
let mainContent;
let defaultHashValue = "contact";

var hashChanged = false;
var foregroundHidden = true;
var currentSection;

var hashEnum = {
    contact: 0,
    resume: 1,
    education: 2,
    experience: 3,
    involvement: 4,
    skills: 5,
    stars: 6
  };

window.onload = function () {
    headerTitle = document.getElementById("headerTitle");
    headerTitleLink = document.getElementById("headerTitleLink");
    headerLocationInfo = document.getElementById("headerLocationInfo");
    mainMenu = document.getElementById("mainMenu");
    mainContent = document.getElementById("content");
    footer = document.getElementById("footer");

    initStars();

    window.onhashchange = hashChange;
    
    hashChange();
};

function hashChange() {
    if(location.hash == "") {
        displaySection(defaultHashValue);
    } else {
        var hashValue = location.hash.toLowerCase().substring(1);
        var hashNum = hashEnum[hashValue];
        var invalidHash = false;
    
        if(!isNaN(hashNum)){
            if(hashNum == 6) {
                foregroundHidden = false;
                toggleForeground();
            } else if(0 <= hashNum && hashNum <= 6) {
                foregroundHidden = true;
                toggleForeground();
                displaySection(hashValue);
            } else {
                invalidHash = true;
            }
        } else {
            invalidHash = true;
        }
        
        if(invalidHash) {
            console.log("Invalid hash value: " + hashValue);
            console.log("Hash options:", Object.keys(hashEnum));
            location.hash = "";
            displaySection(defaultHashValue);
        }
    }
}

function displaySection(sectionId) {
    if(!sectionId) {
        sectionId = defaultHashValue;
    }

    location.hash = sectionId;

    if(currentSection) {
        currentSection.classList.add("hidden");
        document.getElementById(currentSection.id + "NavItem").classList.remove("active");
    }

    mainContent.scrollLeft = 0;
    mainContent.scrollTop = 0;

    currentSection = document.getElementById(sectionId);
    currentSection.classList.remove("hidden");

    document.getElementById(sectionId + "NavItem").classList.add("active");
}

function toggleForeground() {
    if(foregroundHidden) {
        headerTitleLink.href = "#stars";
        headerTitleLink.title = "Just The Stars";

        headerTitle.style.opacity = "1";
        headerLocationInfo.style.opacity = "1";
        mainMenu.style.opacity = "1";
        footer.style.opacity = "1";
        mainContent.style.opacity = "1";

        foregroundHidden = false;
    } else {
        let newHash = currentSection ? currentSection.id : "";
        headerTitleLink.href = "#" + newHash;
        headerTitleLink.title = "Show Content";

        headerTitle.style.opacity = "0.1";
        headerLocationInfo.style.opacity = "0";
        mainMenu.style.opacity = "0";
        footer.style.opacity = "0";
        mainContent.style.opacity = "0";

        foregroundHidden = true;
    }
}