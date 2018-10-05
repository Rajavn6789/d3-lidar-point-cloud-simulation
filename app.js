/**
 * @description: D3 Lidar Obstacle Detection andn Point Cloud Simulation
 * @author: Rajavenkateshwaran Subramanian <rajavenkateshwaran.s@happiestminds.com>
 * @version: 1.0.0
*/

const floorWidth = 600;
const floorHeight = 500;

const robotParams = {
  robotX: 210,
  robotY: 300,
  robotHeight: 70,
  robotWidth: 70,
  wheelHeight: 25,
  wheelWidth: 10,
  senderReceiverGap: 5,
};

const jsonPillars = [
  {
    name: 'pillar1', x_axis: 150, y_axis: 120, height: 40, width: 40, color: 'green',
  },
  {
    name: 'pillar2', x_axis: 240, y_axis: 40, height: 40, width: 40, color: 'red',
  },
  {
    name: 'pillar3', x_axis: 370, y_axis: 80, height: 40, width: 40, color: 'yellow',
  },
];

const jsonWalls = [
  {
    x_axis: 0, y_axis: 450, height: 50, width: 150, color: 'white',
  },
  {
    x_axis: 450, y_axis: 450, height: 50, width: 150, color: 'white',
  },
];

const jsonCircles = [
  {
    x_axis: 300, y_axis: 180, radius: 20, color: 'purple',
  },
];


const signalmidPoint = robotParams.robotX + (robotParams.robotWidth / 2);


let signalX = 0;
const signalY = 0;

// Draw floor and point cloud containers
const floorContainer = d3.select('#simulator').append('svg').attr('width', floorWidth).attr('height', floorHeight)
  .style('background', '#f2f2f2');
const pointCloudContainer = d3.select('#simulator').append('svg').attr('width', floorWidth).attr('height', floorHeight)
  .style('background', '#f2f2f2');

// TODO: add function comments and docs
function drawWalls(svg, arr) {
  svg.append('g').attr('id', 'walls').selectAll('rect')
    .data(arr)
    .enter()
    .append('rect')
    .attr('x', w => w.x_axis)
    .attr('y', w => w.y_axis)
    .attr('height', w => w.height)
    .attr('width', w => w.width)
    .style('fill', w => w.color);
}

// Add x and y axis
function drawAxis(svg, w, h) {
  const xScale = d3.scaleLinear()
    .domain([0, w])
    .range([0, w]);

  const yScale = d3.scaleLinear()
    .domain([0, h])
    .range([0, h]);

  svg.append('g').call(d3.axisBottom().scale(xScale));
  svg.append('g').call(d3.axisRight().scale(yScale));
}

function drawPillars(svg, arr) {
  svg.append('g').attr('id', 'pillars').selectAll('rect')
    .data(arr)
    .enter()
    .append('rect')
    .attr('x', p => p.x_axis)
    .attr('y', p => p.y_axis)
    .attr('height', p => p.height)
    .attr('width', p => p.width)
    .style('fill', p => p.color);
}

function drawCircles(svg, arr) {
  svg.append('g').attr('id', 'circles').selectAll('circle')
    .data(arr)
    .enter()
    .append('circle')
    .attr('cx', c => c.x_axis)
    .attr('cy', c => c.y_axis)
    .attr('r', c => c.radius)
    .attr('fill', c => c.color);
}


function drawRobot(svg, params = {}) {
  const {
    robotX, robotY, robotHeight, robotWidth, wheelHeight, wheelWidth,
  } = params;

  // Body
  svg.append('rect')
    .attr('x', robotX)
    .attr('y', robotY)
    .attr('height', robotHeight)
    .attr('width', robotWidth)
    .style('fill', 'red');

  // Wheel1
  svg.append('rect')
    .attr('x', robotX)
    .attr('y', robotY)
    .attr('height', wheelHeight)
    .attr('width', wheelWidth)
    .style('fill', 'black');

  // Wheel2
  svg.append('rect')
    .attr('x', robotX)
    .attr('y', robotY + robotHeight - wheelHeight)
    .attr('height', wheelHeight)
    .attr('width', wheelWidth)
    .style('fill', 'black');

  // Wheel3
  svg.append('rect')
    .attr('x', robotX + robotWidth - wheelWidth)
    .attr('y', robotY)
    .attr('height', wheelHeight)
    .attr('width', wheelWidth)
    .style('fill', 'black');

  // Wheel4
  svg.append('rect')
    .attr('x', robotX + robotWidth - wheelWidth)
    .attr('y', robotY + robotHeight - wheelHeight)
    .attr('height', wheelHeight)
    .attr('width', wheelWidth)
    .style('fill', 'black');
}

function drawPointCloud(svg, x, y) {
  svg.append('circle')
    .attr('class', 'pc')
    .attr('cx', x)
    .attr('cy', y)
    .attr('r', 2)
    .attr('fill', 'black');
}

function stopLidarSignal() {
  d3.selectAll('line').remove();
}

function clearPointCloud() {
  d3.selectAll('circle.pc').remove();
}

function createRobotGroup(svg) {
  svg.append('g').attr('id', 'robot');
}


function startLidarSignals(svg, floorWidth, midPoint, senderReceiverGap, robotY) {
  const pillar1 = jsonPillars.find(obj => obj.name === 'pillar1');
  const pillar2 = jsonPillars.find(obj => obj.name === 'pillar2');
  const pillar3 = jsonPillars.find(obj => obj.name === 'pillar3');
  const box1Intersect = lineBoxIntersection(signalX, 0, midPoint, robotY, pillar1.x_axis, pillar1.y_axis, pillar1.width, pillar1.height);
  const box2Intersect = lineBoxIntersection(signalX, 0, midPoint, robotY, pillar2.x_axis, pillar2.y_axis, pillar2.width, pillar2.height);
  const box3Intersect = lineBoxIntersection(signalX, 0, midPoint, robotY, pillar3.x_axis, pillar3.y_axis, pillar3.width, pillar3.height);
  const circleIntersect = lineCircleIntersection(signalX, 0, midPoint, robotY, 300, 180, 20);

  // remove older signals
  d3.selectAll('line').remove();

  // TODO: Move to separate functions
  // draw signal 1
  const lidarSignal1 = svg.append('line')
    .attr('id', 'signal1')
    .attr('x1', signalX)
    .attr('x2', midPoint - senderReceiverGap)
    .attr('y1', signalY)
    .attr('y2', robotY)
    .attr('stroke-width', '2');

  // draw signal 2
  const lidarSignal2 = svg.append('line')
    .attr('id', 'signal2')
    .attr('x1', signalX)
    .attr('x2', midPoint + senderReceiverGap)
    .attr('y1', signalY)
    .attr('y2', robotY)
    .attr('stroke-width', '2');


  // Calcuate x and y during interesection
  let x = null;
  let y = null;
  let isIntersecting = false;

  if (circleIntersect) {
    isIntersecting = true;
    ({ x, y } = circleIntersect);
  } else if (box1Intersect) {
    isIntersecting = true;
    ({ x, y } = box1Intersect);
  } else if (box2Intersect) {
    isIntersecting = true;
    ({ x, y } = box2Intersect);
  } else if (box3Intersect) {
    isIntersecting = true;
    ({ x, y } = box3Intersect);
  } else {
    x = 0;
    y = 0;
    isIntersecting = false;
  }

  // change colour, x and y of the signal during intersection
  if (isIntersecting) {
    lidarSignal1
      .attr('stroke', '#ffaaaa')
      .attr('x1', x)
      .attr('y1', y);
    lidarSignal2
      .attr('stroke', '#ffaaaa')
      .attr('x1', x)
      .attr('y1', y);
    drawPointCloud(pointCloudContainer, x, y);
  } else {
    lidarSignal1
      .attr('stroke', '#87f287');
    lidarSignal2
      .attr('stroke', '#87f287');
    drawPointCloud(pointCloudContainer, signalX, signalY);
  }

  // incremenet x of signal by 5px
  if (signalX >= floorWidth) {
    clearPointCloud();
    signalX = 0;
  } else {
    signalX += 5;
  }
}

let t;

function startSimulation() {
  t = setInterval(startLidarSignals, 100, robotGroup, floorWidth, signalmidPoint, robotParams.senderReceiverGap, robotParams.robotY);
}

function pauseSimulation() {
  clearInterval(t);
}

function resetSimulation() {
  signalX = 0;
  pauseSimulation();
  clearPointCloud();
  stopLidarSignal();
}

// Start and Stop Simulation
function addControls() {
  const startSimButton = document.getElementById('start_sim');
  const pauseSimButton = document.getElementById('pause_sim');
  const resetSimButton = document.getElementById('reset_sim');

  startSimButton.addEventListener('click', startSimulation);
  pauseSimButton.addEventListener('click', pauseSimulation);
  resetSimButton.addEventListener('click', resetSimulation);
}

// draw environments
drawWalls(floorContainer, jsonWalls);
drawAxis(floorContainer, floorWidth, floorHeight);
drawPillars(floorContainer, jsonPillars);
drawCircles(floorContainer, jsonCircles);

// draw robot
createRobotGroup(floorContainer);
const robotGroup = d3.select('#robot');
drawRobot(robotGroup, robotParams);

// add button control
addControls();
