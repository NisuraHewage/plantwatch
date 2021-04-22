import 'package:flutter/material.dart';
import 'package:flutter_html/flutter_html.dart';

class DiseaseDetails extends StatefulWidget {
  @override
  _DiseaseDetailsState createState() => _DiseaseDetailsState();
}

class _DiseaseDetailsState extends State<DiseaseDetails> {
  String getDiseaseInformation() {}

  @override
  Widget build(BuildContext context) {
    Widget diseaseFound() {
      return Container(
        color: Color(0xffEAF8F4),
        child: Column(
          children: [
            Container(
              height: 200,
              width: 270,
              decoration: BoxDecoration(
                  color: Color(0xff2B3648),
                  borderRadius: BorderRadius.all(Radius.circular(5))),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.center,
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: [
                  Text(
                    "We predict that it's",
                    style: TextStyle(fontSize: 24, color: Colors.white),
                  ),
                  Text(
                    "Late Blight".toUpperCase(),
                    style: TextStyle(
                        fontSize: 30,
                        fontWeight: FontWeight.bold,
                        color: Colors.white),
                  ),
                ],
              ),
            ),
            Container(
              padding: const EdgeInsets.only(left: 20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    "Disease Information",
                    textAlign: TextAlign.start,
                    style: TextStyle(),
                  ),
                  Html(data: "<h1>PUKA</h1>")
                ],
              ),
            ),
          ],
        ),
      );
    }

    return Scaffold(
        appBar: AppBar(
          title: Text(
            "Results",
            style: TextStyle(color: Colors.black54),
          ),
          centerTitle: true,
          elevation: 0,
          backgroundColor: Color(0xffEAF8F4),
        ),
        body: diseaseFound());
  }
}
