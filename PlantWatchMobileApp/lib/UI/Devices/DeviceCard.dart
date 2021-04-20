import 'package:flutter/material.dart';

class DeviceCard extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Card(
      color: Colors.grey,
      child: Row(
        children: [Text("Device Name"), Text("Status")],
      ),
    );
  }
}
