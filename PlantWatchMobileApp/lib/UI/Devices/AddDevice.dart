import 'package:flutter/material.dart';
import 'DeviceCard.dart';

class AddDevice extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Color(0xffEAF8F4),
      appBar: AppBar(
        backgroundColor: Color(0xffEAF8F4),
        elevation: 0,
        title: Text(
          "Devices",
          style: TextStyle(color: Colors.black87),
        ),
        centerTitle: true,
      ),
      // floatingActionButton: FloatingActionButton(
      //     onPressed: () {
      //       print("pressed");
      //     },
      //     child: Column(
      //       children: [
      //         Text("Add a device"),
      //         Icon(Icons.add),
      //       ],
      //     )),
      body: SingleChildScrollView(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Container(
              child: Column(
                children: [
                  FloatingActionButton(
                    backgroundColor: Color(0xff16C7BD),
                    onPressed: () {
                      print("pressed");
                    },
                    child: Icon(
                      Icons.add,
                      size: 30,
                    ),
                  ),
                  SizedBox(
                    height: 30,
                  ),
                  Text(
                    "Device not bound yet.\nClick the + button to sync with your device! \nPlease ensure that your device switched on",
                    textAlign: TextAlign.center,
                  ),
                  SizedBox(
                    height: 30,
                  ),
                ],
              ),
            ),
            DeviceCard()
          ],
        ),
      ),
    );
  }
}
