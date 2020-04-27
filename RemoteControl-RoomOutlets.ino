char currentCommand;

int pinOne = 5;
int pinTwo = 6;
int pinThree = 7;

void setup(){
  pinMode(pinOne, OUTPUT);
  pinMode(pinTwo, OUTPUT);
  pinMode(pinThree, OUTPUT);
  
  Serial.begin(9600);
  Serial.println("Initialized!");
}

void loop(){

  //reset pins (Remote Registers a 'High' Signal as an open circuit, and a LOW as a closed circuit
  digitalWrite(pinOne, HIGH);
  digitalWrite(pinTwo, HIGH);
  digitalWrite(pinThree, HIGH);

  if(Serial.available() > 0){         //  When there's Serial data available...
    currentCommand = Serial.read();   //    Store it in currentCommand.

    if(currentCommand == 49){ //  49 = "1", serially; 50 = "2", etc.
      Serial.print("\tSwitching 1...");
      digitalWrite(pinOne, LOW);
      delay(500);                     // Each Button needs time to 'charge' up
      Serial.println("\tDone.");
      
    } else if (currentCommand == 50){
      Serial.print("\Switching 2...");
      digitalWrite(pinTwo, LOW);
      delay(500);
      Serial.println("\tDone.");
      
    } else if (currentCommand == 51){
      Serial.print("\tSwitching 3...");
      digitalWrite(pinThree, LOW);
      delay(500);
      Serial.println("\tDone.");
      
    } else if (currentCommand != 13) {  // Empty line
      Serial.println("Invalid Response.");
    }
  
  }  
}
