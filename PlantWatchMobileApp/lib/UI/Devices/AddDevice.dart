import 'dart:convert';
import 'dart:io';
import 'package:flutter/material.dart';
import 'DeviceCard.dart';
import 'package:uuid/uuid.dart';
import 'package:path_provider/path_provider.dart';
import 'package:http/http.dart' as http;
import '../AddPlant/AddPlant.dart';

class AddDevice extends StatefulWidget {
  @override
  _AddDeviceState createState() => _AddDeviceState();
}

class _AddDeviceState extends State<AddDevice> {
  bool isLoading = false;
  String deviceUUId = "";
  List<dynamic> allDevices = [];
  Future<String> get _localPath async {
    final directory = await getApplicationDocumentsDirectory();

    return directory.path;
  }

  Future<File> get _localFile async {
    final path = await _localPath;
    return File('$path/serverDeviceId.txt');
  }

  Future<File> writeDeviceId(String deviceId) async {
    final file = await _localFile;

    // Write the file.
    return file.writeAsString('$deviceId');
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

  Future<String> readToken() async {
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

  Future<File> get _localFile_02 async {
    final path = await _localPath;
    return File('$path/deviceUUID.txt');
  }

  Future<File> writeDeviceUUId(String deviceId) async {
    final file = await _localFile_02;

    // Write the file.
    return file.writeAsString('$deviceId');
  }

  Future<void> addDevice() async {
    var uuid = Uuid();
    var response = null;
    setState(() {
      deviceUUId = uuid.v1().toString();
    });
    writeDeviceId(deviceUUId).then((value) {
      response = addDeviceCloud(deviceUUId).then((value) {
        writeDeviceId(json.decode(value)['created'].toString())
            .then((value) {});
      });
    });

    // String url =
    //     "http://192.168.4.1/userId:12435/userIdsdeviceID:${uuid.v1()}/deviceIDSSID:testing/SSIDpass:1234/passH";
    // Map jsonMap = {};
    // var response = await apiRequest(url, jsonMap).then((value) {

    // });
    return response;
  }

  Future<String> getDevices() {
    var response = readToken().then((value) async {
      print(value);
      String url =
          "https://xssbntn2e9.execute-api.us-east-1.amazonaws.com/SysAdmin/v1/devices?userId=3";
      var response = await http.get(url, headers: {
        HttpHeaders.authorizationHeader:
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRpbnVnYTRAZ21haWwuY29tIiwidXNlcklkIjo5LCJpYXQiOjE2MTkxMjIyMDksImV4cCI6MTY1MDY1ODIwOX0.apBfj6KsOHpYd3utOBvdaTmyqlfvLX201XNRqzReIj8',
        HttpHeaders.contentTypeHeader: 'application/json',
      });
      // var response = await apiRequest(url, jsonMap);
      print(response.body);
      setState(() {
        allDevices = json.decode(response.body)['result'];
        isLoading = true;
      });
    });

    return response;
  }

  Future<String> addDeviceCloud(String uuid) async {
    String url =
        "https://xssbntn2e9.execute-api.us-east-1.amazonaws.com/SysAdmin/v1/devices";
    Map jsonMap = {
      'userId': '3',
      'deviceId': uuid,
    };
    var response = await apiRequest(url, jsonMap);
    print(response);
    return response;
  }

  List<Widget> createDeviceCard() {
    List<Widget> deviceCards = [];
    for (int i = 0; i < allDevices.length; i++) {
      deviceCards.add(Padding(
        padding: const EdgeInsets.all(20.0),
        child: Container(
          height: 150,
          decoration: BoxDecoration(
              color: Color(0xff2B3648),
              borderRadius: BorderRadius.all(Radius.circular(5))),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: [
                  Text(
                    "Device ${i + 1}",
                    style: TextStyle(color: Colors.white, fontSize: 20),
                  ),
                  Text(
                    "Active",
                    style: TextStyle(color: Color(0xff16C7BD), fontSize: 20),
                  )
                ],
              ),
              InkWell(
                onTap: () {},
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
    return deviceCards;
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
    getDevices();
  }

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
      body: isLoading
          ? SingleChildScrollView(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Container(
                    child: Column(
                      children: [
                        FloatingActionButton(
                          backgroundColor: Color(0xff16C7BD),
                          onPressed: () {
                            addDevice().then((value) {
                              Navigator.push(
                                context,
                                MaterialPageRoute(
                                    builder: (context) => new AddPlant(
                                          deviceUUID: deviceUUId,
                                        )),
                              );
                            });
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
                  Column(
                    children: createDeviceCard(),
                  )
                ],
              ),
            )
          : Center(child: CircularProgressIndicator()),
    );
  }
}
