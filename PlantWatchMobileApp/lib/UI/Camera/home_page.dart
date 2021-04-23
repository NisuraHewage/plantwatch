import 'dart:io';

import 'package:camera/camera.dart';
import 'take_picture_page.dart';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import './take_picture_page.dart';
import 'package:dio/dio.dart';
import 'package:http_parser/http_parser.dart';
import 'package:mime_type/mime_type.dart';
import 'dart:io' as Io;
import 'package:flutter_image_compress/flutter_image_compress.dart';

class HomePage extends StatefulWidget {
  @override
  _HomePageState createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  String _path = null;

  void _showPhotoLibrary() async {
    final file = await ImagePicker.pickImage(source: ImageSource.gallery);

    setState(() {
      _path = file.path;
    });
    diseasenew(file.path);
  }

  Future<void> diseasenew(String filePath) async {
    String mimeType = mime('test.png');
    String mimee = mimeType.split('/')[0];
    String type = mimeType.split('/')[1];
    var result = await FlutterImageCompress.compressWithFile(filePath,
        quality: 6, minHeight: 10, minWidth: 10);
    print(result.buffer.lengthInBytes);

    final bytes = await Io.File(filePath).readAsBytes();
    print(bytes);

    Dio dio = new Dio();

    FormData formData = new FormData.fromMap({
      'image': await MultipartFile.fromBytes(bytes,
          filename: 'test.png', contentType: MediaType(mimee, type))
    });
    dio.options.headers["Content-Type"] =
        "multipart/form-data; boundary=--${formData.boundary}";
    print(formData.boundary);
    Response response = await dio
        .post(
            'https://xssbntn2e9.execute-api.us-east-1.amazonaws.com/SysAdmin/v1/predict?userId=1',
            data: formData)
        .catchError((e) => print(e.response.toString()));
    print(response.toString());
  }

  void _showCamera() async {
    final cameras = await availableCameras();
    final camera = cameras.first;

    final result = await Navigator.push(
        context,
        MaterialPageRoute(
            builder: (context) => TakePicturePage(camera: camera)));

    setState(() {
      _path = result;
    });
  }

  void _showOptions(BuildContext context) {
    showModalBottomSheet(
        context: context,
        builder: (context) {
          return Container(
              height: 150,
              child: Column(children: <Widget>[
                ListTile(
                    onTap: () {
                      Navigator.pop(context);
                      _showCamera();
                    },
                    leading: Icon(Icons.photo_camera),
                    title: Text("Take a picture from camera")),
                ListTile(
                    onTap: () {
                      Navigator.pop(context);
                      _showPhotoLibrary();
                    },
                    leading: Icon(Icons.photo_library),
                    title: Text("Choose from photo library"))
              ]));
        });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        body: SafeArea(
      child: Column(children: <Widget>[
        _path == null
            ? Image.asset("images/place-holder.png")
            : Image.file(File(_path)),
        FlatButton(
          child: Text("Take Picture", style: TextStyle(color: Colors.white)),
          color: Colors.green,
          onPressed: () {
            _showOptions(context);
          },
        )
      ]),
    ));
  }
}
