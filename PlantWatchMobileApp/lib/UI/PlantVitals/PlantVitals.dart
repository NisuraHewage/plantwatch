import 'dart:async';
import 'dart:convert';
import 'dart:io';

import 'package:flutter/material.dart';
import '../Notifications/Notifications.dart';
import '../Auth/Login/Login.dart';
import '../Camera/home_page.dart';
import '../SmartConfig/SmartConfig.dart';
import 'package:http/http.dart' as http;

class PlantVitalsDashbaord extends StatefulWidget {
  @override
  _PlantVitalsDashbaordState createState() => _PlantVitalsDashbaordState();
}

class _PlantVitalsDashbaordState extends State<PlantVitalsDashbaord> {
  String moisture = "";
  String temperature = "";
  String light = "";
  String humidity = "";

  final String postsURL =
      "https://xssbntn2e9.execute-api.us-east-1.amazonaws.com/SysAdmin/v1/readings?deviceId=1";
  Timer timer;
  @override
  void initState() {
    super.initState();
    getReadings();
    timer = Timer.periodic(Duration(seconds: 10), (Timer t) => getReadings());
  }

  @override
  void dispose() {
    timer?.cancel();
    super.dispose();
  }

  Future<void> getReadings() async {
    var queryParameters = {
      'param1': 'one',
      'param2': 'two',
    };

    var response = await http.get(postsURL, headers: {
      HttpHeaders.authorizationHeader:
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRpbnVnYTRAZ21haWwuY29tIiwidXNlcklkIjo5LCJpYXQiOjE2MTkxMjIyMDksImV4cCI6MTY1MDY1ODIwOX0.apBfj6KsOHpYd3utOBvdaTmyqlfvLX201XNRqzReIj8',
      HttpHeaders.contentTypeHeader: 'application/json',
    });
    var jsonRes = json.decode(response.body);
    print(jsonRes['readings'][0]['Light']);
    setState(() {
      moisture = jsonRes['readings'][0]['Moisture'];
      light = jsonRes['readings'][0]['Light'];
      humidity = jsonRes['readings'][0]['Humidity'];
      temperature = jsonRes['readings'][0]['Temperature'];
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Color(0xffEAF8F4),
      body: SingleChildScrollView(
        child: Container(
          padding: const EdgeInsets.only(top: 50, left: 20, right: 20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              // RaisedButton(onPressed: () {
              //   Navigator.push(
              //     context,
              //     MaterialPageRoute(builder: (context) => LoginScreen()),
              //   );
              // }),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Image.asset('assets/settings.png'),
                  Center(
                    child: Text("Vitals",
                        style:
                            TextStyle(color: Color(0xff2B3648), fontSize: 24)),
                  ),
                  Image.asset('assets/bell.png')
                ],
              ),
              // InkWell(
              //   onTap: () {
              //     Navigator.push(
              //       context,
              //       MaterialPageRoute(builder: (context) => HomePage()),
              //     );
              //   },
              //   child: Container(
              //     child: Text(
              //       "Puk Plant",
              //       style: TextStyle(fontSize: 20, color: Colors.red),
              //     ),
              //   ),
              // ),
              // InkWell(
              //   onTap: () {
              //     Navigator.push(
              //       context,
              //       MaterialPageRoute(builder: (context) => SmartConfig()),
              //     );
              //   },
              //   child: Container(
              //     child: Text(
              //       "Puk Plant",
              //       style: TextStyle(fontSize: 20, color: Colors.red),
              //     ),
              //   ),
              // ),
              SizedBox(
                height: 40,
              ),
              Container(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                  children: [
                    new Container(
                      decoration: new BoxDecoration(
                          color: Color(0xff2B3648),
                          borderRadius: BorderRadius.circular(10)),
                      width: MediaQuery.of(context).size.width,
                      height: 80,
                      child: Padding(
                        padding: const EdgeInsets.all(20),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Row(
                              children: [
                                Image.asset('assets/droplet.png'),
                                SizedBox(
                                  width: 10,
                                ),
                                Text(
                                  "Soil Moisture",
                                  style: TextStyle(
                                      fontSize: 20, color: Color(0xffEAF8F4)),
                                )
                              ],
                            ),
                            Container(
                              height: 30,
                              width: 50,
                              decoration: BoxDecoration(
                                  color: Color(0xff16C7BD),
                                  // border: Border.all(
                                  //   color: Colors.red[500],
                                  // ),
                                  borderRadius:
                                      BorderRadius.all(Radius.circular(18))),
                              child: Center(
                                child: Text(
                                  "$moisture",
                                  style: TextStyle(
                                      fontSize: 18, color: Colors.white),
                                ),
                              ),
                            )
                          ],
                        ),
                      ),
                    ),
                    SizedBox(height: 40),
                    new Container(
                      decoration: new BoxDecoration(
                          color: Color(0xff2B3648),
                          borderRadius: BorderRadius.circular(10)),
                      width: MediaQuery.of(context).size.width,
                      height: 80,
                      child: Padding(
                        padding: const EdgeInsets.all(20),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Row(
                              children: [
                                Image.asset('assets/sun.png'),
                                SizedBox(
                                  width: 10,
                                ),
                                Text(
                                  "Temperature",
                                  style: TextStyle(
                                      fontSize: 20, color: Color(0xffEAF8F4)),
                                )
                              ],
                            ),
                            Container(
                              height: 30,
                              width: 50,
                              decoration: BoxDecoration(
                                  color: Color(0xff16C7BD),
                                  // border: Border.all(
                                  //   color: Colors.red[500],
                                  // ),
                                  borderRadius:
                                      BorderRadius.all(Radius.circular(18))),
                              child: Center(
                                child: Text(
                                  "$temperature",
                                  style: TextStyle(
                                      fontSize: 18, color: Colors.white),
                                ),
                              ),
                            )
                          ],
                        ),
                      ),
                    ),
                    SizedBox(height: 40),
                    new Container(
                      decoration: new BoxDecoration(
                          color: Color(0xff2B3648),
                          borderRadius: BorderRadius.circular(10)),
                      width: MediaQuery.of(context).size.width,
                      height: 80,
                      child: Padding(
                        padding: const EdgeInsets.all(20),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Row(
                              children: [
                                Image.asset('assets/zap.png'),
                                SizedBox(
                                  width: 10,
                                ),
                                Text(
                                  "Light Intensity",
                                  style: TextStyle(
                                      fontSize: 20, color: Color(0xffEAF8F4)),
                                )
                              ],
                            ),
                            Container(
                              height: 30,
                              width: 50,
                              decoration: BoxDecoration(
                                  color: Color(0xff16C7BD),
                                  // border: Border.all(
                                  //   color: Colors.red[500],
                                  // ),
                                  borderRadius:
                                      BorderRadius.all(Radius.circular(18))),
                              child: Center(
                                child: Text(
                                  "$light",
                                  style: TextStyle(
                                      fontSize: 18, color: Colors.white),
                                ),
                              ),
                            )
                          ],
                        ),
                      ),
                    ),
                    SizedBox(height: 40),
                    new Container(
                      decoration: new BoxDecoration(
                          color: Color(0xff2B3648),
                          borderRadius: BorderRadius.circular(10)),
                      width: MediaQuery.of(context).size.width,
                      height: 80,
                      child: Padding(
                        padding: const EdgeInsets.all(20),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Row(
                              children: [
                                Image.asset('assets/umbrella.png'),
                                SizedBox(
                                  width: 10,
                                ),
                                Text(
                                  "Atmospheric Humidity",
                                  style: TextStyle(
                                      fontSize: 18, color: Color(0xffEAF8F4)),
                                )
                              ],
                            ),
                            Container(
                              height: 30,
                              width: 50,
                              decoration: BoxDecoration(
                                  color: Color(0xff16C7BD),
                                  // border: Border.all(
                                  //   color: Colors.red[500],
                                  // ),
                                  borderRadius:
                                      BorderRadius.all(Radius.circular(18))),
                              child: Center(
                                child: Text(
                                  "$humidity",
                                  style: TextStyle(
                                      fontSize: 18, color: Colors.white),
                                ),
                              ),
                            )
                          ],
                        ),
                      ),
                    )
                  ],
                ),
              ),
              SizedBox(height: 30),
              Container(
                  child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Image.asset('assets/cycle.png'),
                  SizedBox(width: 10),
                  Text("Last reading: when you pissed onto the plants")
                ],
              ))
            ],
          ),
        ),
      ),
    );
  }
}
