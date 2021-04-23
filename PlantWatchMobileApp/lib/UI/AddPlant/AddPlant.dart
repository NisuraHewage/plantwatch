import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;
import 'package:flutter/material.dart';
import 'package:path_provider/path_provider.dart';

class AddPlant extends StatefulWidget {
  final String deviceUUID;

  const AddPlant({Key key, this.deviceUUID}) : super(key: key);
  @override
  _AddPlantState createState() => _AddPlantState();
}

class _AddPlantState extends State<AddPlant> {
  List<dynamic> allProfiles = [];
  Future<String> get _localPath async {
    final directory = await getApplicationDocumentsDirectory();

    return directory.path;
  }

  Future<File> get _localFile async {
    final path = await _localPath;
    return File('$path/serverDeviceId.txt');
  }

  Future<File> get _localFile_02 async {
    final path = await _localPath;
    return File('$path/deviceUUID.txt');
  }

  Future<String> readDeviceUUId() async {
    try {
      final file = await _localFile_02;

      // Read the file.
      String contents = await file.readAsString();

      return contents;
    } catch (e) {
      // If encountering an error, return 0.
      return "error";
    }
  }

  Future<String> readDeviceId() async {
    try {
      final file = await _localFile;

      // Read the file.
      String contents = await file.readAsString();

      return contents;
    } catch (e) {
      // If encountering an error, return 0.
      return "error";
    }
  }

  Future<String> getProfile() async {
    String url =
        'https://xssbntn2e9.execute-api.us-east-1.amazonaws.com/SysAdmin/v1/profiles?plantName=';

    var response = await http.get(url, headers: {
      HttpHeaders.authorizationHeader:
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRpbnVnYTRAZ21haWwuY29tIiwidXNlcklkIjo5LCJpYXQiOjE2MTkxMjIyMDksImV4cCI6MTY1MDY1ODIwOX0.apBfj6KsOHpYd3utOBvdaTmyqlfvLX201XNRqzReIj8',
      HttpHeaders.contentTypeHeader: 'application/json',
    });
    // var response = await apiRequest(url, jsonMap);
    return response.body;
  }

  Future<String> addPlant(String name, int profileId) async {
    print(widget.deviceUUID);
    String url =
        'https://xssbntn2e9.execute-api.us-east-1.amazonaws.com/SysAdmin/v1/plants';
    Map map = {
      'plantName': 'jhgjhgjgjhgj',
      'plantProfileId': profileId,
      'deviceId': widget.deviceUUID,
      'userId': '3'
    };

    var response = await apiRequest(url, map);
    print(response);
  }

  Future<String> apiRequest(String url, Map jsonMap) async {
    HttpClient httpClient = new HttpClient();
    HttpClientRequest request = await httpClient.postUrl(Uri.parse(url));
    request.headers.set('content-type', 'application/json');
    request.add(utf8.encode(json.encode(jsonMap)));
    HttpClientResponse response = await request.close();
    // todo - you should check the response.statusCode
    String reply = await response.transform(utf8.decoder).join();
    httpClient.close();
    return reply;
  }

  @override
  void initState() {
    // TODO: implement initState
    super.initState();
    getProfile().then((value) {
      var profiles = json.decode(value)['result'];
      setState(() {
        allProfiles = profiles;
      });
    });
  }

  List<Widget> allProfileWidget() {
    List<Widget> widgets = [];
    for (int i = 0; i < allProfiles.length; i++) {
      widgets.add(Padding(
        padding: const EdgeInsets.only(top: 20, left: 50),
        child: Container(
          decoration: BoxDecoration(
              color: Color(0xff2B3648),
              borderRadius: BorderRadius.all(Radius.circular(5))),
          height: 200,
          width: 250,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: [
              Container(
                height: 100,
                width: 100,
                child: Image.network(
                  allProfiles[i]['ImageUrl'],
                  fit: BoxFit.contain,
                ),
              ),
              Text(
                allProfiles[i]['Name'],
                style: TextStyle(color: Colors.white, fontSize: 18),
              ),
              InkWell(
                onTap: () {
                  addPlant(allProfiles[i]['Name'], allProfiles[i]['Id']);
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
        ),
      ));
    }
    return widgets;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        elevation: 0,
        centerTitle: true,
        backgroundColor: Color(0xffEAF8F4),
        title: Text("Choose your plant"),
      ),
      body: SingleChildScrollView(
        scrollDirection: Axis.vertical,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: allProfileWidget(),
        ),
      ),
    );
  }
}
