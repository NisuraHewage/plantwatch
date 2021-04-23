import 'package:camera/camera.dart';
import 'package:flutter/material.dart';
import 'package:path/path.dart';
import 'package:path_provider/path_provider.dart';
import 'package:dio/dio.dart';
import 'package:http_parser/http_parser.dart';
import 'package:mime_type/mime_type.dart';
import 'dart:io' as Io;
import 'package:flutter_image_compress/flutter_image_compress.dart';
import 'package:camerawesome/camerawesome_plugin.dart';

class TakePicturePage extends StatefulWidget {
  final CameraDescription camera;
  TakePicturePage({@required this.camera});

  @override
  _TakePicturePageState createState() => _TakePicturePageState();
}

class _TakePicturePageState extends State<TakePicturePage> {
  CameraController _cameraController;
  Future<void> _initializeCameraControllerFuture;

  @override
  void initState() {
    super.initState();

    _cameraController =
        CameraController(widget.camera, ResolutionPreset.medium);

    _initializeCameraControllerFuture = _cameraController.initialize();
  }

  Future<void> diseasenew(String filePath) async {
    String mimeType = mime(filePath);
    String mimee = mimeType.split('/')[0];
    String type = mimeType.split('/')[1];
    print(mimeType);
    var result = await FlutterImageCompress.compressWithFile(filePath,
        quality: 50, minHeight: 480, minWidth: 720);
    print(result.buffer.lengthInBytes);

    final bytes = Io.File(filePath).readAsBytesSync();
    print(filePath.split('/')[filePath.split('/').length - 1]);

    Dio dio = new Dio();

    FormData formData = new FormData.fromMap({
      'file': MultipartFile.fromBytes(bytes,
          filename: filePath.split('/')[filePath.split('/').length - 1],
          contentType: MediaType(mimee, type))
    });
    print(formData.boundary);
    Response response = await dio
        .post(
            'http://mlmodel-env.eba-rq8ips76.us-east-1.elasticbeanstalk.com/predict',
            data: formData)
        .catchError((e) => print(e.response.toString()));
    print(response.toString());
  }

//https://xssbntn2e9.execute-api.us-east-1.amazonaws.com/SysAdmin/v1/predict?userId=1
  void _takePicture(BuildContext context) async {
    try {
      await _initializeCameraControllerFuture;

      final path =
          join((await getTemporaryDirectory()).path, '${DateTime.now()}.png');

      await _cameraController.takePicture(path);
      diseasenew(path);
      Navigator.pop(context, path);
    } catch (e) {
      print(e);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Stack(children: <Widget>[
      FutureBuilder(
        future: _initializeCameraControllerFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.done) {
            return CameraPreview(_cameraController);
          } else {
            return Center(child: CircularProgressIndicator());
          }
        },
      ),
      SafeArea(
        child: Align(
          alignment: Alignment.bottomRight,
          child: Padding(
            padding: const EdgeInsets.all(8.0),
            child: FloatingActionButton(
              backgroundColor: Colors.black,
              child: Icon(Icons.camera),
              onPressed: () {
                _takePicture(context);
              },
            ),
          ),
        ),
      )
    ]);
  }

  @override
  void dispose() {
    _cameraController.dispose();
    super.dispose();
  }
}
