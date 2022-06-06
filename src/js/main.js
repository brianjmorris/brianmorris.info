var headerTitleLink;
var headerTitle;
var headerLocationInfo;
var headerLocationInfoLink;
var headerNav;
var headerNavLinks;
var mobileMenuButton;
var mainContent;
var footer;
var overlay;
var defaultSectionId = "contact";
var fadeLength = 3000;

var foregroundHidden = true;
var currentSection;

var hashEnum = {
    menu: 0,
    contact: 1,
    resume: 2,
    education: 3,
    experience: 4,
    involvement: 5,
    skills: 6,
    stars: 7
  };

window.onload = function () {
    headerTitle = document.getElementById("header-title");
    headerTitleLink = document.getElementById("header-title-link");
    headerLocationInfo = document.getElementById("header-location-info");
    headerLocationInfoLink = document.getElementById("header-location-info-link");
    headerNav = document.getElementById("header-nav");
    headerNavLinks = document.getElementsByClassName("header-nav-item");
    mobileMenuButton = document.getElementById("mobile-menu-button");
    mainContent = document.getElementById("content");
    footer = document.getElementById("footer");
    overlay = document.getElementById("overlay");

    initStars();

    window.onhashchange = hashChange;
    
    hashChange();
};

function hashChange() {
    if(location.hash == "") {
        displaySection(defaultSectionId);
    } else {
        var hashValue = location.hash.toLowerCase().substring(1);

        var hashNum = hashEnum[hashValue];
        var invalidHash = false;
    
        if(!isNaN(hashNum)){
            if(hashNum == 7) {
                foregroundHidden = false;
                toggleForeground();
            } else if(0 <= hashNum && hashNum <= 7) {
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
            displaySection(defaultSectionId);
        }
    }
}

function displaySection(sectionId) {
    if(!sectionId) {
        sectionId = defaultSectionId;
    }

    if(currentSection) {
        currentSection.classList.add("hidden");
        currentSectionHeaderNavItem = document.getElementById(currentSection.id + "-header-nav-item");

        if(currentSectionHeaderNavItem) {
            currentSectionHeaderNavItem.classList.remove("active");
        }
    }

    if(sectionId == "menu") {
        if(currentSection) {
            mobileMenuButton.href = "#" + currentSection.id;
        } else {
            mobileMenuButton.href = "#" + defaultSectionId;
        }
    } else {
        mobileMenuButton.href = "#menu";
    }

    mainContent.scrollLeft = 0;
    mainContent.scrollTop = 0;

    currentSection = document.getElementById(sectionId);
    currentSection.classList.remove("hidden");
    currentSectionHeaderNavItem = document.getElementById(currentSection.id + "-header-nav-item");

    if(currentSectionHeaderNavItem) {
        currentSectionHeaderNavItem.classList.add("active");
    }

    location.hash = sectionId;
}

function toggleForeground() {
    if(foregroundHidden) {
        headerTitleLink.href = "#stars";
        headerTitleLink.title = "Watch the stars";

        overlay.style.display = "none";
        mobileMenuButton.classList.remove("deactivated-link");
        headerLocationInfoLink.classList.remove("deactivated-link");

        for(var i = 0; i < headerNavLinks.length; i++) {
            headerNavLinks[i].classList.remove("deactivated-link");
        }

        headerTitle.style.opacity = "1";
        mainContent.style.opacity = "1";
        mobileMenuButton.style.opacity = "1";
        headerNav.style.opacity = "1";
        headerLocationInfo.style.opacity = "1";
        footer.style.opacity = "1";

        foregroundHidden = false;
    } else {
        var newHash = currentSection ? currentSection.id : "";
        headerTitleLink.href = "#" + newHash;
        headerTitleLink.title = "Show Content";

        overlay.style.display = "block";
        mobileMenuButton.classList.add("deactivated-link");
        headerLocationInfoLink.classList.add("deactivated-link");

        for(var j = 0; j < headerNavLinks.length; j++) {
            headerNavLinks[j].classList.add("deactivated-link");
        }

        headerTitle.style.opacity = "0.1";
        mainContent.style.opacity = "0";
        mobileMenuButton.style.opacity = "0";
        headerNav.style.opacity = "0";
        headerLocationInfo.style.opacity = "0";
        footer.style.opacity = "0";

        foregroundHidden = true;
    }
}