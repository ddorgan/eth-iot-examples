import RpiLeds from 'rpi-leds';
import Web3 from 'web3';
import gpio from 'gpio';
var sleep = require('sleep');
var Gopigo = require('node-gopigo').Gopigo
var Commands = Gopigo.commands
var Robot = Gopigo.robot
var robot

export default (app) => {
  console.log("Hi from GoPiGo movement example...")
  const leds = new RpiLeds();
  const web3 = new Web3();
  web3.setProvider(new web3.providers.HttpProvider("http://localhost:8545"));


  //var coinbase = web3.eth.coinbase;
  const coinbase = "0x00a329c0648769A73afAc7F9381E08FB43dBEA72";
  var balance = web3.eth.getBalance(coinbase);

  var contractAddress = '0xEb0f590d3675aC0AF1333663588d2493d8B536B2';

  var ABI = JSON.parse('[{"constant":true,"inputs":[],"name":"getData","outputs":[{"name":"retData","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"inData","type":"uint256"}],"name":"setData","outputs":[],"payable":false,"type":"function"},{"anonymous":false,"inputs":[{"indexed":false,"name":"msgData","type":"uint256"}],"name":"blinkEvent","type":"event"}]');

  const blinkContract = web3.eth.contract(ABI).at(contractAddress);

  robot = new Robot({
  minVoltage: 5.5,
  criticalVoltage: 1.2,
  debug: true,
  })

 robot.on('init', function onInit(res) {
  if (res) {
    console.log('GoPiGo Ready!')
  } else {
    console.log('Something went wrong during the init.')
  }
  })

  robot.init()

   blinkContract.blinkEvent({}, (error, msg)=> {
    if(!error) {
      console.log(msg);
      app.robotMove();
    } else {
      console.log(error);
    }
  });

  function doCommand() { 
   console.log('Dance time!!')
   robot.motion.right(false);
   sleep.sleep(1);
   robot.motion.left(false);
   sleep.sleep(1);
   robot.motion.backward(false);
   sleep.sleep(1);
   robot.motion.stop()
   }


  app.robotMove = () => {
    let iv = setInterval(()=>{
   doCommand();

    }, 500);

    setTimeout(()=>{
      clearInterval(iv);
    }, 10000)
  }


  return app;
}
