import 'package:flutter/material.dart';
import 'DeviceCard.dart';

class AddDevice extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(),
      floatingActionButton: FloatingActionButton(
          onPressed: () {
            print("pressed");
          },
          child: Column(
            children: [
              Text("Add a device"),
              Icon(Icons.add),
            ],
          )),
      body: SingleChildScrollView(
        child: Column(
          children: [DeviceCard()],
        ),
      ),
    );
  }
}
