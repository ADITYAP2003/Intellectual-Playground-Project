document.addEventListener("DOMContentLoaded", function () {
  const assignButton = document.querySelector(".assign-button");
  const abilityInput = document.getElementById("ability-input");
  const leftCardImg = document.querySelector(".left-card img");
  const rightCardImg = document.querySelector("#right-card-img");
  const rightCard = document.querySelector(".right-card");
  const leftCard = document.querySelector(".left-card");
  const container = document.querySelector(".container");

  let attackButtonAdded = false;
  let attackLineDrawn = false;

  assignButton.addEventListener("click", function (event) {
    event.preventDefault();

    if (abilityInput.value.trim() === "") {
      assignButton.disabled = true;
      return;
    }

    rightCardImg.src = leftCardImg.src;

    if (!attackButtonAdded) {
      const attackButton = document.createElement("button");
      attackButton.textContent = "Attack";
      attackButton.classList.add("attack-button");

      leftCard.appendChild(attackButton);

      attackButtonAdded = true;

      attackButton.addEventListener("click", function () {
        if (!attackLineDrawn) {
          if (leftCardImg.src !== rightCardImg.src) {
            container.innerHTML = "";

            const youWonMessage = document.createElement("h1");
            youWonMessage.textContent = "You Won!";

            const nextButton = document.createElement("button");
            nextButton.textContent = "Next";
            nextButton.classList.add("next-button");

            nextButton.addEventListener("click", function () {
              window.location.href = "/static/html/rightInfo/copyRight.html";
            });

            const messageContainer = document.createElement("div");
            messageContainer.appendChild(youWonMessage);
            messageContainer.appendChild(nextButton);

            container.appendChild(messageContainer);
          } else {
            const line = document.createElement("div");
            line.classList.add("attack-line");

            const leftRect = leftCardImg.getBoundingClientRect();
            const rightRect = rightCardImg.getBoundingClientRect();

            const leftX = leftRect.left + leftRect.width / 2;
            const leftY = leftRect.top + leftRect.height / 2;
            const rightX = rightRect.left + rightRect.width / 2;
            const rightY = rightRect.top + rightRect.height / 2;

            const length = Math.sqrt(
              (rightX - leftX) ** 2 + (rightY - leftY) ** 2
            );
            const angle =
              Math.atan2(rightY - leftY, rightX - leftX) * (180 / Math.PI);

            line.style.width = length + "px";
            line.style.transform = `rotate(${angle}deg)`;
            line.style.left = leftX + "px";
            line.style.top = leftY + "px";

            document.body.appendChild(line);
            attackLineDrawn = true;

            const attackCancelledMessage = document.createElement("p");
            attackCancelledMessage.textContent =
              "Attack failed! Both cards are same because enemy copied your card. use copyright button to avoid copy of your card and then attack";
            attackCancelledMessage.style.color = "red";
            rightCard.appendChild(attackCancelledMessage);

            const copyRightButton = document.createElement("button");
            copyRightButton.textContent = "Use Copyright";
            copyRightButton.style.color = "green";
            rightCard.appendChild(copyRightButton);

            copyRightButton.addEventListener("click", function () {
              rightCardImg.src = "/static/assets/systemWeapon.jpg";
              const line = document.querySelector(".attack-line");
              if (line) {
                line.parentNode.removeChild(line);
                attackLineDrawn = false;
              }
            });
          }
        }
      });
    }
  });

  abilityInput.addEventListener("input", function () {
    assignButton.disabled = abilityInput.value.trim() === "";
  });
});
