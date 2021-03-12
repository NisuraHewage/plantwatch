import 'package:flutter/material.dart';

class PlantVital extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      color: Colors.white,
      width: MediaQuery.of(context).size.width,
      height: 200,
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Row(
          children: [
            Row(
              children: [Image.asset('assets/drop.png'), Text("Soil Moisture")],
            ),
            Text("80%")
          ],
        ),
      ),
    );
  }
}
