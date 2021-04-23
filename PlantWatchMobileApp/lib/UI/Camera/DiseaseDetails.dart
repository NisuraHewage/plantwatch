import 'dart:convert';
import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter_html/flutter_html.dart';
import 'package:http/http.dart' as http;

class DiseaseDetails extends StatefulWidget {
  final String predictedDisease;
  const DiseaseDetails({Key key, this.predictedDisease}) : super(key: key);

  @override
  _DiseaseDetailsState createState() => _DiseaseDetailsState();
}

class _DiseaseDetailsState extends State<DiseaseDetails> {
  String htmlContent = "<p></p>";
  Future<String> getDiseaseInformation() async {
    String url =
        'https://xssbntn2e9.execute-api.us-east-1.amazonaws.com/SysAdmin/v1/profile?profileId=18';

    var response = await http.get(url, headers: {
      HttpHeaders.authorizationHeader:
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRpbnVnYTRAZ21haWwuY29tIiwidXNlcklkIjo5LCJpYXQiOjE2MTkxMjIyMDksImV4cCI6MTY1MDY1ODIwOX0.apBfj6KsOHpYd3utOBvdaTmyqlfvLX201XNRqzReIj8',
      HttpHeaders.contentTypeHeader: 'application/json',
    });
    // var response = await apiRequest(url, jsonMap);
    return response.body;
  }

  @override
  void initState() {
    // TODO: implement initState
    super.initState();
    getDiseaseInformation().then((value) {
      print(json
          .decode(value)['result'][0]['Diseases']
          .toString()
          .toLowerCase()
          .split(widget.predictedDisease.toLowerCase())[1]);
      var split = json
          .decode(value)['result'][0]['Diseases']
          .toString()
          .toLowerCase()
          .split(widget.predictedDisease.toLowerCase())[1];
      split = split.substring(2, split.length - 1);
      split = split.substring(0, split.length - 2);
      print(split);
      setState(() {
        htmlContent = split;
      });
    });
  }

  @override
  Widget build(BuildContext context) {
    Widget diseaseFound() {
      return Container(
        color: Color(0xffEAF8F4),
        child: widget.predictedDisease != "" &&
                widget.predictedDisease != "null"
            ? Column(
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
                          widget.predictedDisease.toUpperCase(),
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
                      children: [Html(data: htmlContent)],
                    ),
                  ),
                ],
              )
            : Container(
                child: Center(
                child: Column(
                  children: [
                    Text("Detection Failed"),
                    Text(
                        "The image is out of focus, please move closer to your crop and hold still to focus your camera"),
                    InkWell(
                      onTap: () {
                        Navigator.of(context).pop();
                      },
                      child: Container(
                        decoration: BoxDecoration(
                            color: Color(0xff16C7BD),
                            borderRadius: BorderRadius.all(Radius.circular(5))),
                        child: Padding(
                          padding: const EdgeInsets.all(8.0),
                          child: Text(
                            "Choose Plant",
                            style: TextStyle(color: Colors.black54),
                          ),
                        ),
                      ),
                    )
                  ],
                ),
              )),
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
