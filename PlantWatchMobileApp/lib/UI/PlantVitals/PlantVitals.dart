import 'package:flutter/material.dart';

class PlantVitalsDashbaord extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Color(0xffe8e8e8),
      body: Container(
        padding: const EdgeInsets.only(top: 60, left: 20, right: 20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Image.asset('assets/settings.png'),
                Image.asset('assets/bell.png')
              ],
            ),
            Container(
              child: Text(
                "Puk Plant",
                style: TextStyle(fontSize: 20, color: Colors.red),
              ),
            ),
            SizedBox(
              height: 100,
            ),
            Container(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: [
                  new Container(
                    decoration: new BoxDecoration(
                        color: Colors.white,
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
                              Image.asset('assets/drop.png'),
                              SizedBox(
                                width: 10,
                              ),
                              Text(
                                "Soil Moisture",
                                style: TextStyle(fontSize: 20),
                              )
                            ],
                          ),
                          Text(
                            "80%",
                            style: TextStyle(fontSize: 20, color: Colors.grey),
                          )
                        ],
                      ),
                    ),
                  ),
                  SizedBox(height: 40),
                  new Container(
                    decoration: new BoxDecoration(
                        color: Colors.white,
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
                              Image.asset('assets/bright.png'),
                              SizedBox(
                                width: 10,
                              ),
                              Text(
                                "Temperature",
                                style: TextStyle(fontSize: 20),
                              )
                            ],
                          ),
                          Text(
                            "80%",
                            style: TextStyle(fontSize: 20, color: Colors.grey),
                          )
                        ],
                      ),
                    ),
                  ),
                  SizedBox(height: 40),
                  new Container(
                    decoration: new BoxDecoration(
                        color: Colors.white,
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
                                "Light Intensity",
                                style: TextStyle(fontSize: 20),
                              )
                            ],
                          ),
                          Text(
                            "80%",
                            style: TextStyle(fontSize: 20, color: Colors.grey),
                          )
                        ],
                      ),
                    ),
                  ),
                  SizedBox(height: 40),
                  new Container(
                    decoration: new BoxDecoration(
                        color: Colors.white,
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
                                style: TextStyle(fontSize: 20),
                              )
                            ],
                          ),
                          Text(
                            "80%",
                            style: TextStyle(fontSize: 20, color: Colors.grey),
                          )
                        ],
                      ),
                    ),
                  )
                ],
              ),
            ),
            SizedBox(height: 60),
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
    );
  }
}
