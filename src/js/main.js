var mainContent;
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
    initStars();

    mainContent = document.getElementById("content");

    window.onhashchange = hashChange;
    
    hashChange();
}

function hashChange() {
    if(location.hash == "") {
        displaySection("contact");
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
            console.error("Invalid hash value");
            console.log("Hash options:", Object.keys(hashEnum))
        }
    }
}

function displaySection(sectionId) {
    if(!sectionId) {
        sectionId = "contact";
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
        document.getElementById("headerTitleLink").href = "#stars";
        document.getElementById("headerTitleLink").title = "Just The Stars";

        document.getElementById("headerTitle").style.opacity = "1";
        document.getElementById("headerLocationInfo").style.opacity = "1";
        document.getElementById("mainMenu").style.opacity = "1";
        document.getElementById("footer").style.opacity = "1";
        mainContent.style.opacity = "1";

        foregroundHidden = false;
    } else {
        document.getElementById("headerTitleLink").href = "#";
        document.getElementById("headerTitleLink").title = "Show Content";

        document.getElementById("headerTitle").style.opacity = "0.1";
        document.getElementById("headerLocationInfo").style.opacity = "0";
        document.getElementById("mainMenu").style.opacity = "0";
        document.getElementById("footer").style.opacity = "0";
        mainContent.style.opacity = "0";

        foregroundHidden = true;
    }
}