let skills = [
    { name: "Strength", level: 1, experience: 0, nextLevelExperience: 10, upgradeCost: 10, upgradeMultiplier: 2 },
    { name: "Agility", level: 1, experience: 0, nextLevelExperience: 10, upgradeCost: 10, upgradeMultiplier: 2 },
    { name: "Intelligence", level: 1, experience: 0, nextLevelExperience: 10, upgradeCost: 10, upgradeMultiplier: 2 }
];

const skillLevelElements = document.querySelectorAll(".skill-level");
const experienceElements = document.querySelectorAll(".experience");
const upgradeCostElements = document.querySelectorAll(".upgrade-cost");
const trainButtons = document.querySelectorAll(".train-button");
const upgradeButtons = document.querySelectorAll(".upgrade-button");
const resetButton = document.getElementById("reset-button");

// Initialize progress or load from localStorage
loadProgress();

// Function to update the UI for a skill
const updateSkillUI = (index) => {
    const skill = skills[index];
    skillLevelElements[index].textContent = skill.level;
    experienceElements[index].textContent = skill.experience;
    upgradeCostElements[index].textContent = skill.upgradeCost;
};

// Function to update the timer
const updateTimer = () => {
    setInterval(() => {
        skills.forEach((skill, index) => {
            const trainButton = trainButtons[index];
            const timeLeft = (skill.nextLevelExperience - skill.experience) * (skill.level * 1000);
            const minutes = Math.floor(timeLeft / 60000);
            const seconds = ((timeLeft % 60000) / 1000).toFixed(0);

            if (timeLeft <= 0) {
                trainButton.innerText = "Train";
            } else {
                trainButton.innerText = `Train (${minutes}:${seconds < 10 ? '0' : ''}${seconds})`;
            }
        });
    }, 1000);
};

updateTimer();

// Function to save progress to localStorage
const saveProgress = () => {
    localStorage.setItem("skills", JSON.stringify(skills));
};

// Function to load progress from localStorage
function loadProgress() {
    const savedSkills = JSON.parse(localStorage.getItem("skills"));
    if (savedSkills) {
        skills = savedSkills;
        skills.forEach((_, index) => {
            updateSkillUI(index);
        });
    }
}

// Event listeners for training and upgrading
for (let i = 0; i < skills.length; i++) {
    const trainButton = trainButtons[i];
    const upgradeButton = upgradeButtons[i];

    trainButton.addEventListener("click", () => {
        const skill = skills[i];
        const trainingDuration = skill.level * 2000; // Training time increases with skill level
        trainButton.disabled = true;
        setTimeout(() => {
            skill.experience += skill.level;
            experienceElements[i].textContent = skill.experience;
            trainButton.disabled = false;
            
            if (skill.experience >= skill.nextLevelExperience) {
                skill.level++;
                skill.nextLevelExperience *= 2;
                alert(`Congratulations! You've reached Level ${skill.level} in ${skill.name}!`);
            }
            
            // Save updated progress to localStorage
            saveProgress();
        }, trainingDuration);
    });

    upgradeButton.addEventListener("click", () => {
        const skill = skills[i];
        if (skill.experience >= skill.upgradeCost) {
            skill.experience -= skill.upgradeCost;
            skill.upgradeCost *= skill.upgradeMultiplier;
            skill.level++;
            updateSkillUI(i);
            alert(`You've upgraded ${skill.name} to level ${skill.level}!`);
            saveProgress();
        } else {
            alert(`You don't have enough experience to upgrade ${skill.name}.`);
        }
    });
}

// Event listener for resetting progress
resetButton.addEventListener("click", () => {
    if (confirm("Are you sure you want to reset your progress?")) {
        skills.forEach((skill) => {
            skill.level = 1;
            skill.experience = 0;
            skill.nextLevelExperience = 10;
            skill.upgradeCost = 10;
            skill.upgradeMultiplier = 2;
        });

        skills.forEach((_, index) => {
            updateSkillUI(index);
        });

        saveProgress();
    }
});
