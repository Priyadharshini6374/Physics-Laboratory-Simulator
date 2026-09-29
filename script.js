// ============================================================
// PHYSICS LABORATORY SIMULATOR
// Complete JavaScript
// ============================================================


// ============================================================
// CANVAS SETUP
// ============================================================

const simulationCanvas = document.getElementById("simulationCanvas");
const graphCanvas = document.getElementById("graphCanvas");

const ctx = simulationCanvas.getContext("2d");
const graphCtx = graphCanvas.getContext("2d");


// ============================================================
// GLOBAL VARIABLES
// ============================================================

let currentExperiment = "projectile";
let animationId = null;
let isRunning = false;

let lastTime = 0;
let simulationTime = 0;


// ============================================================
// PROJECTILE VARIABLES
// ============================================================

let projectileX = 0;
let projectileY = 0;
let projectileVX = 0;
let projectileVY = 0;


// ============================================================
// PENDULUM VARIABLES
// ============================================================

let pendulumTheta = 0;
let pendulumOmega = 0;


// ============================================================
// COLLISION VARIABLES
// ============================================================

let collisionX1 = 0;
let collisionX2 = 0;
let collisionV1 = 0;
let collisionV2 = 0;

let collisionStarted = false;


// ============================================================
// FRICTION VARIABLES
// ============================================================

let frictionX = 0;
let frictionVelocity = 0;


// ============================================================
// SPRING VARIABLES
// ============================================================

let springDisplacement = 0;
let springVelocity = 0;


// ============================================================
// FREE FALL VARIABLES
// ============================================================

let freeFallY = 0;
let freeFallVelocity = 0;


// ============================================================
// GRAPH DATA
// ============================================================

let graphData = [];


// ============================================================
// EXPERIMENT INFORMATION
// ============================================================

const experimentInformation = {

    projectile: {
        title: "Projectile Motion",
        description: "Simulate the motion of a projectile launched at an angle.",
        objective: "Study the motion of a projectile under the influence of gravity.",
        formula: "Range = (u² sin 2θ) / g",
        principle: "Horizontal motion remains uniform while vertical motion is affected by gravity."
    },

    pendulum: {
        title: "Simple Pendulum",
        description: "Observe the oscillatory motion of a simple pendulum.",
        objective: "Study the periodic motion of a pendulum.",
        formula: "T = 2π√(L/g)",
        principle: "The pendulum oscillates due to the restoring force caused by gravity."
    },

    collision: {
        title: "Collision",
        description: "Observe the interaction between two moving objects.",
        objective: "Study momentum conservation during a collision.",
        formula: "m₁u₁ + m₂u₂ = m₁v₁ + m₂v₂",
        principle: "Total momentum remains conserved in an isolated system."
    },

    friction: {
        title: "Friction",
        description: "Observe how friction affects the motion of an object.",
        objective: "Study the effect of friction on the motion of an object.",
        formula: "F = μmg",
        principle: "Friction acts opposite to the direction of motion."
    },

    spring: {
        title: "Spring & Mass",
        description: "Observe the oscillation of a mass attached to a spring.",
        objective: "Study simple harmonic motion using a spring and mass.",
        formula: "F = -kx",
        principle: "The restoring force of a spring is proportional to its displacement."
    },

    freefall: {
        title: "Free Fall",
        description: "Observe an object falling under the influence of gravity.",
        objective: "Study the motion of an object falling under gravity.",
        formula: "v = u + gt",
        principle: "A freely falling object accelerates due to gravity."
    }

};


// ============================================================
// HELPER FUNCTION
// ============================================================

function num(id, fallback = 0) {

    const element = document.getElementById(id);

    if (!element) {
        return fallback;
    }

    const value = parseFloat(element.value);

    return Number.isFinite(value) ? value : fallback;
}


// ============================================================
// PARAMETER GETTERS
// ============================================================

function getGravity() {
    return num("gravity", 9.81);
}


// ------------------------------------------------------------
// Projectile
// ------------------------------------------------------------

function getProjectileValues() {

    return {
        velocity: num("velocity", 20),
        angle: num("angle", 45),
        gravity: num("gravity", 9.81)
    };
}


// ------------------------------------------------------------
// Pendulum
// ------------------------------------------------------------

function getPendulumValues() {

    return {
        length: num("pendulumLength", 2),
        angle: num("pendulumAngle", 30),
        gravity: num("gravity", 9.81)
    };
}


// ------------------------------------------------------------
// Collision
// ------------------------------------------------------------

function getCollisionValues() {

    return {
        mass1: num("mass1", 2),
        mass2: num("mass2", 2),
        velocity1: num("velocity1", 5),
        velocity2: num("velocity2", -3)
    };
}


// ------------------------------------------------------------
// Friction
// ------------------------------------------------------------

function getFrictionValues() {

    return {
        mass: num("frictionMass", 5),
        velocity: num("frictionVelocity", 10),
        coefficient: num("frictionCoefficient", 0.3),
        gravity: num("gravity", 9.81)
    };
}


// ------------------------------------------------------------
// Spring
// ------------------------------------------------------------

function getSpringValues() {

    return {
        mass: num("springMass", 2),
        constant: num("springConstant", 20),
        displacement: num("springDisplacement", 0.5)
    };
}


// ------------------------------------------------------------
// Free Fall
// ------------------------------------------------------------

function getFreeFallValues() {

    return {
        height: num("height", 50),
        gravity: num("gravity", 9.81)
    };
}


// ============================================================
// COMPATIBILITY GETTERS
// ============================================================

function getProjectileVelocity() {
    return getProjectileValues().velocity;
}

function getProjectileAngle() {
    return getProjectileValues().angle;
}

function getPendulumLength() {
    return getPendulumValues().length;
}

function getPendulumAngle() {
    return getPendulumValues().angle;
}

function getMass1() {
    return getCollisionValues().mass1;
}

function getMass2() {
    return getCollisionValues().mass2;
}

function getVelocity1() {
    return getCollisionValues().velocity1;
}

function getVelocity2() {
    return getCollisionValues().velocity2;
}

function getFrictionMass() {
    return getFrictionValues().mass;
}

function getFrictionVelocity() {
    return getFrictionValues().velocity;
}

function getFrictionCoefficient() {
    return getFrictionValues().coefficient;
}

function getSpringMass() {
    return getSpringValues().mass;
}

function getSpringConstant() {
    return getSpringValues().constant;
}

function getSpringDisplacement() {
    return getSpringValues().displacement;
}

function getFreefallHeight() {
    return getFreeFallValues().height;
}


// ============================================================
// PARAMETER VISIBILITY
// ============================================================

function updateParameterVisibility() {

    const parameters = document.querySelectorAll(".parameter");

    parameters.forEach(parameter => {
        parameter.style.display = "none";
    });


    function showParameter(id) {

        const input = document.getElementById(id);

        if (!input) return;

        const parameter = input.closest(".parameter");

        if (parameter) {
            parameter.style.display = "block";
        }
    }


    switch (currentExperiment) {

        case "projectile":

            showParameter("velocity");
            showParameter("angle");
            showParameter("gravity");

            break;


        case "pendulum":

            showParameter("pendulumLength");
            showParameter("pendulumAngle");
            showParameter("gravity");

            break;


        case "collision":

            showParameter("mass1");
            showParameter("mass2");
            showParameter("velocity1");
            showParameter("velocity2");

            break;


        case "friction":

            showParameter("frictionMass");
            showParameter("frictionVelocity");
            showParameter("frictionCoefficient");
            showParameter("gravity");

            break;


        case "spring":

            showParameter("springMass");
            showParameter("springConstant");
            showParameter("springDisplacement");

            break;


        case "freefall":

            showParameter("height");
            showParameter("gravity");

            break;
    }
}


// ============================================================
// UPDATE EXPERIMENT INFORMATION
// ============================================================

function updateExperimentInfo() {

    const info = document.getElementById("experimentInfo");
    const title = document.getElementById("experimentTitle");
    const description = document.getElementById("experimentDescription");
    const graphTitle = document.getElementById("graphTitle");

    const current = experimentInformation[currentExperiment];

    if (!current) {
        return;
    }


    // --------------------------------------------------------
    // Main title
    // --------------------------------------------------------

    if (title) {
        title.textContent = current.title;
    }


    // --------------------------------------------------------
    // Description
    // --------------------------------------------------------

    if (description) {
        description.textContent = current.description;
    }


    // --------------------------------------------------------
    // Information panel
    // --------------------------------------------------------

    if (info) {

        info.innerHTML = `
            <h3>Experiment Information</h3>

            <p>
                <strong>Objective:</strong><br>
                ${current.objective}
            </p>

            <p>
                <strong>Formula:</strong><br>
                ${current.formula}
            </p>

            <p>
                <strong>Principle:</strong><br>
                ${current.principle}
            </p>
        `;
    }


    // --------------------------------------------------------
    // Graph heading
    // --------------------------------------------------------

    if (graphTitle) {

        const graphTitles = {

            projectile: "Projectile Velocity vs Time",

            pendulum: "Pendulum Angle vs Time",

            collision: "Collision Velocity vs Time",

            friction: "Friction Velocity vs Time",

            spring: "Spring Velocity vs Time",

            freefall: "Free Fall Velocity vs Time"
        };


        graphTitle.textContent =
            graphTitles[currentExperiment] || "Experiment Graph";
    }
}


// ============================================================
// RESULTS PANEL
// ============================================================

function updateResults() {

    const resultsPanel =
        document.getElementById("resultsPanel");

    if (!resultsPanel) {
        return;
    }


    let html = `
        <h3>Results</h3>
        <div class="results-content">
    `;


    // ========================================================
    // PROJECTILE
    // ========================================================

    if (currentExperiment === "projectile") {

        const velocity = getProjectileVelocity();
        const angle = getProjectileAngle();
        const gravity = getGravity();

        const angleRad = angle * Math.PI / 180;

        const timeOfFlight =
            (2 * velocity * Math.sin(angleRad)) / gravity;

        const range =
            (velocity * velocity * Math.sin(2 * angleRad)) / gravity;

        const maxHeight =
            (velocity * velocity *
                Math.pow(Math.sin(angleRad), 2))
            / (2 * gravity);


        html += `
            <p><strong>Initial Velocity:</strong> ${velocity.toFixed(2)} m/s</p>
            <p><strong>Launch Angle:</strong> ${angle.toFixed(2)}°</p>
            <p><strong>Time of Flight:</strong> ${timeOfFlight.toFixed(2)} s</p>
            <p><strong>Maximum Height:</strong> ${maxHeight.toFixed(2)} m</p>
            <p><strong>Horizontal Range:</strong> ${range.toFixed(2)} m</p>
        `;
    }


    // ========================================================
    // PENDULUM
    // ========================================================

    else if (currentExperiment === "pendulum") {

        const length = getPendulumLength();
        const gravity = getGravity();

        const period =
            2 * Math.PI * Math.sqrt(length / gravity);

        const frequency =
            1 / period;


        html += `
            <p><strong>Pendulum Length:</strong> ${length.toFixed(2)} m</p>
            <p><strong>Time Period:</strong> ${period.toFixed(2)} s</p>
            <p><strong>Frequency:</strong> ${frequency.toFixed(2)} Hz</p>
        `;
    }


    // ========================================================
    // COLLISION
    // ========================================================

    else if (currentExperiment === "collision") {

        const m1 = getMass1();
        const m2 = getMass2();

        const u1 = getVelocity1();
        const u2 = getVelocity2();


        const initialMomentum =
            (m1 * u1) + (m2 * u2);


        html += `
            <p><strong>Mass 1:</strong> ${m1.toFixed(2)} kg</p>
            <p><strong>Mass 2:</strong> ${m2.toFixed(2)} kg</p>
            <p><strong>Initial Velocity 1:</strong> ${u1.toFixed(2)} m/s</p>
            <p><strong>Initial Velocity 2:</strong> ${u2.toFixed(2)} m/s</p>
            <p><strong>Total Initial Momentum:</strong> ${initialMomentum.toFixed(2)} kg·m/s</p>
        `;
    }


    // ========================================================
    // FRICTION
    // ========================================================

    else if (currentExperiment === "friction") {

        const mass = getFrictionMass();
        const velocity = getFrictionVelocity();
        const coefficient = getFrictionCoefficient();
        const gravity = getGravity();


        const frictionForce =
            coefficient * mass * gravity;


        html += `
            <p><strong>Mass:</strong> ${mass.toFixed(2)} kg</p>
            <p><strong>Initial Velocity:</strong> ${velocity.toFixed(2)} m/s</p>
            <p><strong>Friction Coefficient:</strong> ${coefficient.toFixed(2)}</p>
            <p><strong>Friction Force:</strong> ${frictionForce.toFixed(2)} N</p>
        `;
    }


    // ========================================================
    // SPRING
    // ========================================================

    else if (currentExperiment === "spring") {

        const mass = getSpringMass();
        const constant = getSpringConstant();
        const displacement = getSpringDisplacement();


        const force =
            constant * displacement;


        const angularFrequency =
            Math.sqrt(constant / mass);


        const period =
            2 * Math.PI / angularFrequency;


        html += `
            <p><strong>Mass:</strong> ${mass.toFixed(2)} kg</p>
            <p><strong>Spring Constant:</strong> ${constant.toFixed(2)} N/m</p>
            <p><strong>Displacement:</strong> ${displacement.toFixed(2)} m</p>
            <p><strong>Spring Force:</strong> ${force.toFixed(2)} N</p>
            <p><strong>Time Period:</strong> ${period.toFixed(2)} s</p>
        `;
    }


    // ========================================================
    // FREE FALL
    // ========================================================

    else if (currentExperiment === "freefall") {

        const height = getFreefallHeight();
        const gravity = getGravity();


        const time =
            Math.sqrt((2 * height) / gravity);


        const finalVelocity =
            gravity * time;


        html += `
            <p><strong>Initial Height:</strong> ${height.toFixed(2)} m</p>
            <p><strong>Gravity:</strong> ${gravity.toFixed(2)} m/s²</p>
            <p><strong>Time to Ground:</strong> ${time.toFixed(2)} s</p>
            <p><strong>Final Velocity:</strong> ${finalVelocity.toFixed(2)} m/s</p>
        `;
    }


    html += `
        </div>
    `;


    resultsPanel.innerHTML = html;
}


// ============================================================
// SELECT EXPERIMENT
// ============================================================

function selectExperiment(experiment) {

    currentExperiment = experiment;

    pauseSimulation();

    simulationTime = 0;

    graphData = [];


    updateParameterVisibility();

    updateExperimentInfo();

    updateResults();

    resetSimulation();
}


// ============================================================
// START SIMULATION
// ============================================================

function startSimulation() {

    if (isRunning) {
        return;
    }

    isRunning = true;

    lastTime = performance.now();

    animationId =
        requestAnimationFrame(animationLoop);
}


// ============================================================
// PAUSE SIMULATION
// ============================================================

function pauseSimulation() {

    isRunning = false;

    if (animationId !== null) {

        cancelAnimationFrame(animationId);

        animationId = null;
    }
}


// ============================================================
// RESET SIMULATION
// ============================================================

function resetSimulation() {

    pauseSimulation();

    simulationTime = 0;

    graphData = [];


    // ========================================================
    // PROJECTILE
    // ========================================================

    if (currentExperiment === "projectile") {

        const values = getProjectileValues();

        const angleRad =
            values.angle * Math.PI / 180;


        projectileX = 0;

        projectileY = 0;

        projectileVX =
            values.velocity * Math.cos(angleRad);

        projectileVY =
            values.velocity * Math.sin(angleRad);
    }


    // ========================================================
    // PENDULUM
    // ========================================================

    else if (currentExperiment === "pendulum") {

        const values = getPendulumValues();


        pendulumTheta =
            values.angle * Math.PI / 180;

        pendulumOmega = 0;
    }


    // ========================================================
    // COLLISION
    // ========================================================

    else if (currentExperiment === "collision") {

        const values = getCollisionValues();


        collisionX1 = -3;

        collisionX2 = 3;

        collisionV1 = values.velocity1;

        collisionV2 = values.velocity2;

        collisionStarted = false;
    }


    // ========================================================
    // FRICTION
    // ========================================================

    else if (currentExperiment === "friction") {

        const values = getFrictionValues();


        frictionX = 0;

        frictionVelocity = values.velocity;
    }


    // ========================================================
    // SPRING
    // ========================================================

    else if (currentExperiment === "spring") {

        const values = getSpringValues();


        springDisplacement =
            values.displacement;

        springVelocity = 0;
    }


    // ========================================================
    // FREE FALL
    // ========================================================

    else if (currentExperiment === "freefall") {

        const values = getFreeFallValues();


        freeFallY = values.height;

        freeFallVelocity = 0;
    }


    drawSimulation();

    drawGraph();

    updateResults();
}


// ============================================================
// ANIMATION LOOP
// ============================================================

function animationLoop(timestamp) {

    if (!isRunning) {
        return;
    }


    let dt =
        (timestamp - lastTime) / 1000;


    lastTime = timestamp;


    // Prevent huge time jumps
    dt = Math.min(dt, 0.05);


    simulationTime += dt;


    updateSimulation(dt);

    drawSimulation();

    updateGraphData();

    drawGraph();

    updateResults();


    animationId =
        requestAnimationFrame(animationLoop);
}


// ============================================================
// UPDATE SIMULATION
// ============================================================

function updateSimulation(dt) {


    // ========================================================
    // PROJECTILE
    // ========================================================

    if (currentExperiment === "projectile") {

        const gravity = getGravity();


        projectileX += projectileVX * dt;

        projectileY += projectileVY * dt;

        projectileVY -= gravity * dt;


        // Stop when projectile reaches ground
        if (projectileY < 0) {

            projectileY = 0;

            projectileVY = 0;

            pauseSimulation();
        }
    }


    // ========================================================
    // PENDULUM
    // ========================================================

    else if (currentExperiment === "pendulum") {

        const values = getPendulumValues();


        const gravity = values.gravity;

        const length = values.length;


        const angularAcceleration =
            -(gravity / length) *
            Math.sin(pendulumTheta);


        pendulumOmega +=
            angularAcceleration * dt;


        pendulumTheta +=
            pendulumOmega * dt;


        // Small damping
        pendulumOmega *= 0.999;
    }


    // ========================================================
    // COLLISION
    // ========================================================

    else if (currentExperiment === "collision") {

        collisionX1 +=
            collisionV1 * dt;

        collisionX2 +=
            collisionV2 * dt;


        const distance =
            Math.abs(collisionX2 - collisionX1);


        if (distance < 0.8 && !collisionStarted) {

            collisionStarted = true;


            const values =
                getCollisionValues();


            const m1 = values.mass1;

            const m2 = values.mass2;

            const u1 = collisionV1;

            const u2 = collisionV2;


            // Elastic collision
            const v1 =
                ((m1 - m2) * u1 +
                    2 * m2 * u2) /
                (m1 + m2);


            const v2 =
                ((m2 - m1) * u2 +
                    2 * m1 * u1) /
                (m1 + m2);


            collisionV1 = v1;

            collisionV2 = v2;
        }
    }


    // ========================================================
    // FRICTION
    // ========================================================

    else if (currentExperiment === "friction") {

        const values =
            getFrictionValues();


        const frictionAcceleration =
            values.coefficient *
            values.gravity;


        if (Math.abs(frictionVelocity) > 0) {

            frictionVelocity -=
                Math.sign(frictionVelocity) *
                frictionAcceleration *
                dt;


            if (
                Math.sign(frictionVelocity) !==
                Math.sign(
                    frictionVelocity +
                    Math.sign(frictionVelocity) *
                    frictionAcceleration *
                    dt
                )
            ) {

                frictionVelocity = 0;
            }
        }


        frictionX +=
            frictionVelocity * dt;


        if (Math.abs(frictionVelocity) < 0.01) {

            frictionVelocity = 0;

            pauseSimulation();
        }
    }


    // ========================================================
    // SPRING
    // ========================================================

    else if (currentExperiment === "spring") {

        const values =
            getSpringValues();


        const acceleration =
            -(values.constant / values.mass) *
            springDisplacement;


        springVelocity +=
            acceleration * dt;


        springDisplacement +=
            springVelocity * dt;
    }


    // ========================================================
    // FREE FALL
    // ========================================================

    else if (currentExperiment === "freefall") {

        const gravity = getGravity();


        freeFallVelocity +=
            gravity * dt;


        freeFallY -=
            freeFallVelocity * dt;


        if (freeFallY <= 0) {

            freeFallY = 0;

            freeFallVelocity = 0;

            pauseSimulation();
        }
    }
}


// ============================================================
// DRAW SIMULATION
// ============================================================

function drawSimulation() {

    ctx.clearRect(
        0,
        0,
        simulationCanvas.width,
        simulationCanvas.height
    );


    // Background
    ctx.fillStyle = "#f8fafc";

    ctx.fillRect(
        0,
        0,
        simulationCanvas.width,
        simulationCanvas.height
    );


    switch (currentExperiment) {

        case "projectile":
            drawProjectile();
            break;

        case "pendulum":
            drawPendulum();
            break;

        case "collision":
            drawCollision();
            break;

        case "friction":
            drawFriction();
            break;

        case "spring":
            drawSpring();
            break;

        case "freefall":
            drawFreeFall();
            break;
    }
}


// ============================================================
// PROJECTILE DRAWING
// ============================================================

function drawProjectile() {

    const ground =
        simulationCanvas.height - 60;


    // Ground
    ctx.beginPath();

    ctx.moveTo(0, ground);

    ctx.lineTo(
        simulationCanvas.width,
        ground
    );

    ctx.strokeStyle = "#333";

    ctx.lineWidth = 2;

    ctx.stroke();


    // Scale
    const scale = 8;


    const x =
        50 + projectileX * scale;


    const y =
        ground - projectileY * scale;


    // Projectile
    ctx.beginPath();

    ctx.arc(
        x,
        y,
        10,
        0,
        Math.PI * 2
    );

    ctx.fillStyle = "#e63946";

    ctx.fill();


    // Launch point
    ctx.beginPath();

    ctx.arc(
        50,
        ground,
        5,
        0,
        Math.PI * 2
    );

    ctx.fillStyle = "#222";

    ctx.fill();


    // Labels
    ctx.fillStyle = "#222";

    ctx.font = "14px Arial";

    ctx.fillText(
        "Launch",
        35,
        ground + 25
    );

    ctx.fillText(
        "Projectile",
        x + 12,
        y
    );
}


// ============================================================
// PENDULUM DRAWING
// ============================================================

function drawPendulum() {

    const values =
        getPendulumValues();


    const centerX =
        simulationCanvas.width / 2;

    const centerY = 70;


    const scale = 100;

    const length =
        values.length * scale;


    const bobX =
        centerX +
        length *
        Math.sin(pendulumTheta);


    const bobY =
        centerY +
        length *
        Math.cos(pendulumTheta);


    // Pivot
    ctx.beginPath();

    ctx.arc(
        centerX,
        centerY,
        7,
        0,
        Math.PI * 2
    );

    ctx.fillStyle = "#333";

    ctx.fill();


    // Rod
    ctx.beginPath();

    ctx.moveTo(
        centerX,
        centerY
    );

    ctx.lineTo(
        bobX,
        bobY
    );

    ctx.strokeStyle = "#555";

    ctx.lineWidth = 4;

    ctx.stroke();


    // Bob
    ctx.beginPath();

    ctx.arc(
        bobX,
        bobY,
        18,
        0,
        Math.PI * 2
    );

    ctx.fillStyle = "#457b9d";

    ctx.fill();


    ctx.fillStyle = "#222";

    ctx.font = "15px Arial";

    ctx.fillText(
        "Pendulum",
        bobX + 20,
        bobY
    );
}


// ============================================================
// COLLISION DRAWING
// ============================================================

function drawCollision() {

    const centerY =
        simulationCanvas.height / 2;


    const scale = 60;


    const x1 =
        simulationCanvas.width / 2 +
        collisionX1 * scale;


    const x2 =
        simulationCanvas.width / 2 +
        collisionX2 * scale;


    // Track
    ctx.beginPath();

    ctx.moveTo(
        40,
        centerY + 30
    );

    ctx.lineTo(
        simulationCanvas.width - 40,
        centerY + 30
    );

    ctx.strokeStyle = "#444";

    ctx.lineWidth = 3;

    ctx.stroke();


    // Ball 1
    ctx.beginPath();

    ctx.arc(
        x1,
        centerY,
        25,
        0,
        Math.PI * 2
    );

    ctx.fillStyle = "#e76f51";

    ctx.fill();


    // Ball 2
    ctx.beginPath();

    ctx.arc(
        x2,
        centerY,
        25,
        0,
        Math.PI * 2
    );

    ctx.fillStyle = "#2a9d8f";

    ctx.fill();


    ctx.fillStyle = "#222";

    ctx.font = "14px Arial";

    ctx.fillText(
        "m₁",
        x1 - 8,
        centerY + 5
    );

    ctx.fillText(
        "m₂",
        x2 - 8,
        centerY + 5
    );
}


// ============================================================
// FRICTION DRAWING
// ============================================================

function drawFriction() {

    const ground =
        simulationCanvas.height / 2;


    const x =
        100 + frictionX * 30;


    // Surface
    ctx.beginPath();

    ctx.moveTo(
        40,
        ground + 30
    );

    ctx.lineTo(
        simulationCanvas.width - 40,
        ground + 30
    );

    ctx.strokeStyle = "#333";

    ctx.lineWidth = 4;

    ctx.stroke();


    // Object
    ctx.fillStyle = "#f4a261";

    ctx.fillRect(
        x,
        ground - 40,
        80,
        40
    );


    ctx.fillStyle = "#222";

    ctx.font = "14px Arial";

    ctx.fillText(
        "Object",
        x + 18,
        ground - 15
    );


    // Friction arrow
    ctx.beginPath();

    ctx.moveTo(
        x + 40,
        ground + 55
    );

    ctx.lineTo(
        x - 10,
        ground + 55
    );

    ctx.strokeStyle = "#d62828";

    ctx.lineWidth = 3;

    ctx.stroke();


    ctx.fillText(
        "Friction",
        x - 20,
        ground + 80
    );
}


// ============================================================
// SPRING DRAWING
// ============================================================

function drawSpring() {

    const centerY =
        simulationCanvas.height / 2;


    const wallX = 100;


    const massX =
        450 +
        springDisplacement * 150;


    // Wall
    ctx.fillStyle = "#555";

    ctx.fillRect(
        wallX,
        centerY - 80,
        20,
        160
    );


    // Spring
    ctx.beginPath();

    const springStart =
        wallX + 20;


    const springEnd =
        massX;


    const coils = 12;

    const totalLength =
        springEnd - springStart;


    ctx.moveTo(
        springStart,
        centerY
    );


    for (let i = 1; i <= coils; i++) {

        const x =
            springStart +
            (totalLength * i) / coils;


        const y =
            centerY +
            (i % 2 === 0 ? -20 : 20);


        ctx.lineTo(x, y);
    }


    ctx.strokeStyle = "#457b9d";

    ctx.lineWidth = 3;

    ctx.stroke();


    // Mass
    ctx.fillStyle = "#e76f51";

    ctx.fillRect(
        massX,
        centerY - 30,
        60,
        60
    );


    ctx.fillStyle = "#222";

    ctx.font = "14px Arial";

    ctx.fillText(
        "Mass",
        massX + 12,
        centerY + 5
    );
}


// ============================================================
// FREE FALL DRAWING
// ============================================================

function drawFreeFall() {

    const values =
        getFreeFallValues();


    const ground =
        simulationCanvas.height - 60;


    const top =
        60;


    const availableHeight =
        ground - top;


    const normalized =
        freeFallY / values.height;


    const y =
        ground -
        normalized * availableHeight;


    // Ground
    ctx.beginPath();

    ctx.moveTo(
        40,
        ground
    );

    ctx.lineTo(
        simulationCanvas.width - 40,
        ground
    );

    ctx.strokeStyle = "#333";

    ctx.lineWidth = 3;

    ctx.stroke();


    // Object
    ctx.beginPath();

    ctx.arc(
        simulationCanvas.width / 2,
        y,
        18,
        0,
        Math.PI * 2
    );

    ctx.fillStyle = "#e63946";

    ctx.fill();


    ctx.fillStyle = "#222";

    ctx.font = "14px Arial";

    ctx.fillText(
        `Height: ${freeFallY.toFixed(2)} m`,
        simulationCanvas.width / 2 + 25,
        y
    );
}


// ============================================================
// UPDATE GRAPH DATA
// ============================================================

function updateGraphData() {

    let value = 0;


    switch (currentExperiment) {

        case "projectile":

            value =
                Math.sqrt(
                    projectileVX * projectileVX +
                    projectileVY * projectileVY
                );

            break;


        case "pendulum":

            value =
                pendulumTheta *
                180 /
                Math.PI;

            break;


        case "collision":

            value =
                collisionV1;

            break;


        case "friction":

            value =
                frictionVelocity;

            break;


        case "spring":

            value =
                springVelocity;

            break;


        case "freefall":

            value =
                freeFallVelocity;

            break;
    }


    graphData.push({

        time: simulationTime,

        value: value
    });


    // Keep graph size manageable
    if (graphData.length > 300) {

        graphData.shift();
    }
}


// ============================================================
// DRAW GRAPH
// ============================================================

function drawGraph() {

    graphCtx.clearRect(
        0,
        0,
        graphCanvas.width,
        graphCanvas.height
    );


    graphCtx.fillStyle = "#ffffff";

    graphCtx.fillRect(
        0,
        0,
        graphCanvas.width,
        graphCanvas.height
    );


    const padding = 50;


    const width =
        graphCanvas.width -
        padding * 2;


    const height =
        graphCanvas.height -
        padding * 2;


    // --------------------------------------------------------
    // Axes
    // --------------------------------------------------------

    graphCtx.beginPath();

    graphCtx.moveTo(
        padding,
        padding
    );

    graphCtx.lineTo(
        padding,
        graphCanvas.height - padding
    );

    graphCtx.lineTo(
        graphCanvas.width - padding,
        graphCanvas.height - padding
    );

    graphCtx.strokeStyle = "#333";

    graphCtx.lineWidth = 2;

    graphCtx.stroke();


    // --------------------------------------------------------
    // Axis labels
    // --------------------------------------------------------

    graphCtx.fillStyle = "#222";

    graphCtx.font = "13px Arial";


    graphCtx.fillText(
        "Time (s)",
        graphCanvas.width / 2 - 25,
        graphCanvas.height - 15
    );


    graphCtx.save();

    graphCtx.translate(
        15,
        graphCanvas.height / 2
    );

    graphCtx.rotate(-Math.PI / 2);


    let yLabel = "Velocity";


    if (currentExperiment === "pendulum") {
        yLabel = "Angle (°)";
    }

    else if (currentExperiment === "friction") {
        yLabel = "Velocity (m/s)";
    }

    else if (currentExperiment === "spring") {
        yLabel = "Velocity (m/s)";
    }


    graphCtx.fillText(
        yLabel,
        0,
        0
    );


    graphCtx.restore();


    // --------------------------------------------------------
    // No data
    // --------------------------------------------------------

    if (graphData.length < 2) {

        graphCtx.fillStyle = "#777";

        graphCtx.font = "14px Arial";

        graphCtx.fillText(
            "Press Start to generate graph data",
            graphCanvas.width / 2 - 110,
            graphCanvas.height / 2
        );

        return;
    }


    // --------------------------------------------------------
    // Find ranges
    // --------------------------------------------------------

    const times =
        graphData.map(point => point.time);


    const values =
        graphData.map(point => point.value);


    let minTime =
        Math.min(...times);


    let maxTime =
        Math.max(...times);


    let minValue =
        Math.min(...values);


    let maxValue =
        Math.max(...values);


    if (maxTime === minTime) {
        maxTime = minTime + 1;
    }


    if (maxValue === minValue) {

        maxValue += 1;

        minValue -= 1;
    }


    // Add margins
    const valueRange =
        maxValue - minValue;


    minValue -= valueRange * 0.1;

    maxValue += valueRange * 0.1;


    // --------------------------------------------------------
    // Draw graph line
    // --------------------------------------------------------

    graphCtx.beginPath();


    graphData.forEach((point, index) => {

        const x =
            padding +
            ((point.time - minTime) /
                (maxTime - minTime)) *
            width;


        const y =
            graphCanvas.height -
            padding -
            ((point.value - minValue) /
                (maxValue - minValue)) *
            height;


        if (index === 0) {

            graphCtx.moveTo(x, y);

        } else {

            graphCtx.lineTo(x, y);
        }
    });


    graphCtx.strokeStyle = "#2563eb";

    graphCtx.lineWidth = 2;

    graphCtx.stroke();
}


// ============================================================
// INITIALIZATION
// ============================================================

function initializeSimulator() {

    updateParameterVisibility();

    updateExperimentInfo();

    resetSimulation();
}


// ============================================================
// BUTTON COMPATIBILITY
// ============================================================

window.selectExperiment = selectExperiment;

window.startSimulation = startSimulation;

window.pauseSimulation = pauseSimulation;

window.resetSimulation = resetSimulation;


// ============================================================
// START APPLICATION
// ============================================================

initializeSimulator();