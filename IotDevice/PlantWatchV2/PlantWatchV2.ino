#include <WiFi.h>
#include <HTTPClient.h>
#include "SparkFunHTU21D.h"
#include "time.h"
#include <iostream>
#include <sstream>  
HTU21D myHumidity;

const char *ssid = "Test";
const char *password = "";

String userID,deviceID,ssidName,passPhrase;

// Set your Static IP address
IPAddress local_IP(192, 168, 1, 184);
// Set your Gateway IP address
IPAddress gateway(192, 168, 1, 1);

IPAddress subnet(255, 255, 0, 0);
IPAddress primaryDNS(8, 8, 8, 8);   //optional
IPAddress secondaryDNS(8, 8, 4, 4); //optional

WiFiServer server(80);
using namespace std;  
const char* ntpServer = "pool.ntp.org";
const long  gmtOffset_sec = 16200;
const int   daylightOffset_sec = 3600;
String callTime[4] = {"7", "11", "23", "4"};
struct tm timeinfo2;

const String endpoint = "https://gfvpdn2440.execute-api.us-east-1.amazonaws.com/v1/readings";
WiFiServer server(80);

void printLocalTime()
{
  struct tm timeinfo;
  if(!getLocalTime(&timeinfo)){
    Serial.println("Failed to obtain time");
    return;
  }
  Serial.println(&timeinfo, "%H:%M:%S");
}

void show_yes_no(const char *prefix, int val)
{
  Serial.print(prefix);
  if (val)
    Serial.println("yes");
  else
    Serial.println("no");
}

void dump_user_register()
{
  byte reg = myHumidity.readUserRegister();

  Serial.print("Resolution (Humidity, Temperature): ");
  switch (reg & USER_REGISTER_RESOLUTION_MASK) {
  case USER_REGISTER_RESOLUTION_RH12_TEMP14: Serial.print(12); Serial.print(", "); Serial.println(14); break;
  case USER_REGISTER_RESOLUTION_RH8_TEMP12: Serial.print(8); Serial.print(", "); Serial.println(12); break;
  case USER_REGISTER_RESOLUTION_RH10_TEMP13: Serial.print(10); Serial.print(", "); Serial.println(13); break;
  case USER_REGISTER_RESOLUTION_RH11_TEMP11: Serial.print(11); Serial.print(", "); Serial.println(11); break;
  }

  show_yes_no("End of battery: ", reg & USER_REGISTER_END_OF_BATTERY);
  show_yes_no("Heater enabled: ", reg & USER_REGISTER_HEATER_ENABLED);
  show_yes_no("Disable OTP reload: ", reg & USER_REGISTER_DISABLE_OTP_RELOAD);
}

void setup() {
  Serial.begin(115200);
Serial.println();
  Serial.println("Configuring access point...");
  
if (!WiFi.config(local_IP, gateway, subnet, primaryDNS, secondaryDNS)) {
    Serial.println("STA Failed to configure");
  }
  // You can remove the password parameter if you want the AP to be open.
  WiFi.softAP(ssid, password);
  IPAddress myIP = WiFi.softAPIP();
  Serial.print("AP IP address: ");
  Serial.println(myIP);
  server.begin();

  Serial.println("Server started");

  Serial.println("WiFi Connected.");

//init and get the time
  configTime(gmtOffset_sec, daylightOffset_sec, ntpServer);
  printLocalTime();
  
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());
  server.begin();
  Serial.println("Server Up");
  Serial.println("Waiting for User ID");
  while(!userIdRecived)
    {
WiFiClient client = server.available();   // listen for incoming clients

  if (client) {                             // if you get a client,
    Serial.println("New Client.");           // print a message out the serial port
    String currentLine = "";                // make a String to hold incoming data from the client
    while (client.connected()) {            // loop while the client's connected
      if (client.available()) {             // if there's bytes to read from the client,
        char c = client.read();             // read a byte, then
        Serial.write(c);                    // print it out the serial monitor
        if (c == '\n') {                    // if the byte is a newline character

          // if the current line is blank, you got two newline characters in a row.
          // that's the end of the client HTTP request, so send a response:
          if (currentLine.length() == 0) {
            // HTTP headers always start with a response code (e.g. HTTP/1.1 200 OK)
            // and a content-type so the client knows what's coming, then a blank line:
            client.println("HTTP/1.1 200 OK");
            client.println("Content-type:text/html");
            client.println();
            client.print("Click <a href=\"/H\">here</a> to turn ON the LED.<br>");
            client.print("Click <a href=\"/L\">here</a> to turn OFF the LED.<br>");
            client.println();

            break;
          } else {  
            currentLine = "";
          }
        } else if (c != '\r') {
          currentLine += c;      
        }
         if((currentLine.indexOf("deviceID:") > 0) && (currentLine.endsWith("H"))){
          Serial.println(currentLine.indexOf("deviceID:"));
          Serial.println(currentLine);
          userID=currentLine.substring(currentLine.indexOf("userId:")+7,currentLine.indexOf("/userIds:"));
          deviceID=currentLine.substring(currentLine.indexOf("deviceID:")+9,currentLine.indexOf("/deviceID"));
          ssidName=currentLine.substring(currentLine.indexOf("SSID:")+5,currentLine.indexOf("/SSID"));
          passPhrase=currentLine.substring(currentLine.indexOf("pass:")+5,currentLine.indexOf("/pass"));
          Serial.println("deviceID: "+deviceID);
          Serial.println("ssid: "+ssidName);
          Serial.println("passPhrase: "+passPhrase);
        }
      }
    }
    // close the connection:
    client.stop();
    Serial.println("Client Disconnected.");
  }
    }
  
  myHumidity.begin();
  
  dump_user_register();
//  WiFi.begin(ssid, password);
 
 
}
void loop() {

 
  if ((WiFi.status() == WL_CONNECTED)) {

    
    if (userIdRecived){

    Serial.println(&timeinfo2);
  int second,minute,hour;
  stringstream ss,mm,hh;  
  string s,m,h;  

  second = timeinfo2.tm_sec;
  ss << second;  
  ss >> s;  
  
  minute = timeinfo2.tm_min   ; 
  mm << minute;    
  mm >> m;

  hour = timeinfo2.tm_hour   ; 
  hh << hour;    
  hh >> h;

  
  //printf(s.c_str());
  Serial.println(s.c_str());
  Serial.println(m.c_str());
  Serial.println(h.c_str());
  if(!getLocalTime(&timeinfo2)){
    Serial.println("Failed to obtain time");
    return;
  }
  Serial.println(&timeinfo2, "%H:%M:%S");
  
 
    
    String moisture,light;
    HTTPClient http;
    float humid = myHumidity.readHumidity();
    float temp = myHumidity.readTemperature();
  
    Serial.print(" Moisture Level1: ");
    moisture=-((map(analogRead(34), 2000, 4095, 0, 100))-100);
    //Serial.println(analogRead(34));
    Serial.println(moisture);
    Serial.print(" Light level Level: ");
    light=-((map(analogRead(32), 2500, 4095, 0, 100))-100);
    //light=map(analogRead(32), 2000, 4095, 0, 100);
    Serial.println(analogRead(32));
    http.begin(endpoint); //Specify the URL
    
    http.addHeader("Content-Type", "application/json");
    String httpRequestData = "{\"userId\":\""+userID+"\",\"deviceId\": \"1\",\"moisture\": \""+moisture+"\",\"temperature\": \""+temp+"\",\"light\": \""+light+"\",\"humidity\": \""+humid+"\"}";    
    Serial.println(httpRequestData);  
     if (std::find(std::begin(callTime), std::end(callTime), h.c_str()) != std::end(callTime))
  {
    Serial.println("Hour correct");
    if((s.compare("0") == 1) && (m.compare("0") == 1))
    {
            // Send HTTP POST request
    int httpResponseCode = http.POST(httpRequestData);
 
   if (httpResponseCode > 0) {
 
        String payload = http.getString();
        Serial.println(httpResponseCode);
        Serial.println(payload);
      }
    else {
      Serial.println("Error on HTTP request");
    }
 
    http.end();
    }
  } 

  }
  delay(1000);
  }
}
