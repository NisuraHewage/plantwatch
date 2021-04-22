import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'dart:async';
import 'package:firebase_auth/firebase_auth.dart';
import './ForgotPassword.dart';
import '../Signup/signScreen.dart';
import './firebase.dart';
import 'package:progress_dialog/progress_dialog.dart';
import 'package:flutter/services.dart';
import '../../PlantVitals/PlantVitals.dart';
import 'dart:convert';
import 'dart:io';
import 'package:dio/dio.dart';
import 'package:http_parser/http_parser.dart';
import 'package:mime_type/mime_type.dart';

class LoginScreen extends StatefulWidget {
  @override
  _LoginScreenState createState() => new _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  TextEditingController _emailController = TextEditingController();
  TextEditingController _passController = TextEditingController();
  ProgressDialog pr;

  bool _validateEmail = false;
  bool _validatePassword = false;
  bool showProgress = false;
  void validateForm() {
    Pattern pattern =
        r'^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$';
    RegExp regex = new RegExp(pattern);
    if (!regex.hasMatch(_emailController.text)) {
      setState(() {
        _validateEmail = true;
      });
    } else {
      setState(() {
        _validateEmail = false;
      });
    }
    if (_passController.text.length < 8) {
      setState(() {
        _validatePassword = true;
      });
    } else {
      setState(() {
        _validatePassword = false;
      });
    }
  }

  // Future<void> predictDisease() async {
  //   Directory tempDir = await getTemporaryDirectory();
  //   String tempPath = tempDir.path;

  //   Directory appDocDir = await getApplicationDocumentsDirectory();
  //   String appDocPath = appDocDir.path;
  //   String filePath = '${tempDir.path}/assets/test.png';

  //   String url =
  //       'https://xssbntn2e9.execute-api.us-east-1.amazonaws.com/SysAdmin/v1/predict?userId=1';
  //   var postUri = Uri.parse(url);

  //   http.MultipartRequest request = new http.MultipartRequest("POST", postUri);

  //   http.MultipartFile multipartFile = await http.MultipartFile.fromBytes(
  //     'image',
  //     (await rootBundle.load('assets/test.png')).buffer.asUint8List(),
  //     filename: 'test.png', // use the real name if available, or omit
  //     contentType: MediaType('image', 'png'),
  //   );

  //   request.files.add(multipartFile);

  //   http.StreamedResponse response = await request.send();
  //   response.stream.bytesToString().then((value) => print(value));
  // }

  Future<void> diseasenew(String filePath) async {
    String mimeType = mime('test.png');
    String mimee = mimeType.split('/')[0];
    String type = mimeType.split('/')[1];

    Dio dio = new Dio();
    dio.options.headers["Content-Type"] = "multipart/form-data";
    FormData formData = new FormData.fromMap({
      'file': await MultipartFile.fromFile('filePath',
          filename: "fileName", contentType: MediaType(mimee, type))
    });
    Response response = await dio
        .post('http://192.168.18.25:8080/test', data: formData)
        .catchError((e) => print(e.response.toString()));
  }

  void createUser() async {
    String url =
        'https://xssbntn2e9.execute-api.us-east-1.amazonaws.com/SysAdmin/v1/user';
    Map map = {'email': 'dinuga4@gmail.com', 'password': 'Abcdef1324'};

    print(await apiRequest(url, map));
  }

  void login() async {
    String url =
        'https://xssbntn2e9.execute-api.us-east-1.amazonaws.com/SysAdmin/v1/user/login';
    Map map = {
      'email': 'dinuga4@gmail.com',
      'password': 'Abcdef1324',
      'deviceToken':
          'fw8v7ZZ0BQY:APA91bH9ofZrtCaXBuBTMc3SXUkbgN37ryk9geIFrJCewGNklCVkORiIt8hjhqHlQ7dgW8cIikpZEu_EfdmtrIceKrvDjCnviJhrCXV-BWUist1t7g0ZSta2Mv_fCDGUFmU6TFDqf_W5'
    };

    print(await apiRequest(url, map));
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

  Widget radioButton(bool isSelected) => Container(
        width: 16.0,
        height: 16.0,
        padding: EdgeInsets.all(2.0),
        decoration: BoxDecoration(
            shape: BoxShape.circle,
            border: Border.all(width: 2.0, color: Colors.black)),
        child: isSelected
            ? Container(
                width: double.infinity,
                height: double.infinity,
                decoration:
                    BoxDecoration(shape: BoxShape.circle, color: Colors.black),
              )
            : Container(),
      );

  Widget horizontalLine() => Padding(
        padding: EdgeInsets.symmetric(horizontal: 16.0),
        child: Container(
          width: ScreenUtil.getInstance().setWidth(120),
          height: 1.0,
          color: Colors.black26.withOpacity(.2),
        ),
      );

  @override
  Widget build(BuildContext context) {
    SystemChrome.setPreferredOrientations([
      DeviceOrientation.portraitUp,
      DeviceOrientation.portraitDown,
    ]);
    pr = ProgressDialog(context);
    pr = ProgressDialog(context,
        type: ProgressDialogType.Normal, isDismissible: false, showLogs: false);
    pr.style(
        message: 'Logging in...',
        borderRadius: 10.0,
        backgroundColor: Colors.white,
        progressWidget: CircularProgressIndicator(),
        elevation: 10.0,
        insetAnimCurve: Curves.easeInOut,
        progress: 0.0,
        maxProgress: 100.0,
        progressTextStyle: TextStyle(
            color: Colors.black54, fontSize: 13.0, fontWeight: FontWeight.w400),
        messageTextStyle: TextStyle(
            color: Colors.black54,
            fontSize: 19.0,
            fontWeight: FontWeight.w600));
    ScreenUtil.instance = ScreenUtil.getInstance()..init(context);
    ScreenUtil.instance =
        ScreenUtil(width: 750, height: 1334, allowFontScaling: true);
    return new Scaffold(
      backgroundColor: Color(0xffEAF8F4),
      resizeToAvoidBottomInset: true,
      body: new Stack(
        fit: StackFit.expand,
        children: <Widget>[
          Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: <Widget>[
              Padding(
                padding: EdgeInsets.only(top: 80.0),
                child: Image.asset(
                  "assets/logo.png",
                  scale: 1.5,
                ),
              ),
            ],
          ),
          SizedBox(
            height: ScreenUtil.getInstance().setHeight(180),
          ),
          SingleChildScrollView(
            child: Padding(
              padding: EdgeInsets.only(left: 28.0, right: 28.0, top: 100.0),
              child: Column(
                children: <Widget>[
                  SizedBox(
                    height: ScreenUtil.getInstance().setHeight(180),
                  ),
                  Container(
                    width: double.infinity,
                    height: ScreenUtil.getInstance().setHeight(600),
                    child: Padding(
                      padding:
                          EdgeInsets.only(left: 16.0, right: 16.0, top: 16.0),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: <Widget>[
                          SizedBox(
                            height: ScreenUtil.getInstance().setHeight(30),
                          ),
                          Text("Email",
                              style: TextStyle(
                                  fontFamily: "Poppins-Bold",
                                  fontSize:
                                      ScreenUtil.getInstance().setSp(30))),
                          TextField(
                            controller: _emailController,
                            decoration: InputDecoration(
                                errorText: _validateEmail
                                    ? "Enter a valid email"
                                    : null,
                                icon: Icon(Icons.account_circle,
                                    color: Color(0xFF1FC9A7)),
                                hintText: "Username",
                                hintStyle: TextStyle(
                                    color: Colors.grey, fontSize: 12.0)),
                          ),
                          SizedBox(
                            height: ScreenUtil.getInstance().setHeight(55),
                          ),
                          Text("Password",
                              style: TextStyle(
                                  fontFamily: "Poppins-Bold",
                                  fontSize:
                                      ScreenUtil.getInstance().setSp(30))),
                          TextField(
                            controller: _passController,
                            obscureText: true,
                            decoration: InputDecoration(
                                errorText: _validatePassword
                                    ? "Enter a valid password"
                                    : null,
                                icon: Icon(Icons.vpn_key,
                                    color: Color(0xFF1FC9A7)),
                                hintText: "Password",
                                hintStyle: TextStyle(
                                    color: Colors.grey, fontSize: 12.0)),
                          ),
                          SizedBox(
                            height: ScreenUtil.getInstance().setHeight(35),
                          ),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.end,
                            children: <Widget>[
                              GestureDetector(
                                onTap: () {
                                  Navigator.push(
                                    context,
                                    MaterialPageRoute(
                                        builder: (context) =>
                                            new ForgotPassword()),
                                  );
                                },
                                child: Text(
                                  "Forgot Password?",
                                  style: TextStyle(
                                      color: Color(0xFF1FC9A7),
                                      fontFamily: "Poppins-Medium",
                                      fontSize:
                                          ScreenUtil.getInstance().setSp(28)),
                                ),
                              )
                            ],
                          )
                        ],
                      ),
                    ),
                  ),
                  //SizedBox(height: ScreenUtil.getInstance().setHeight(0)),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: <Widget>[
                      InkWell(
                        child: Container(
                          width: ScreenUtil.getInstance().setWidth(330),
                          height: ScreenUtil.getInstance().setHeight(100),
                          decoration: BoxDecoration(
                              color: Color(0xFF1FC9A7),
                              borderRadius: BorderRadius.circular(6.0),
                              boxShadow: [
                                BoxShadow(
                                    color: Color(0xFF1FC9A7).withOpacity(.3),
                                    offset: Offset(0.0, 8.0),
                                    blurRadius: 8.0)
                              ]),
                          child: Material(
                            color: Colors.transparent,
                            child: InkWell(
                              onTap: () async {
                                // validateForm();
                                // if (_validateEmail == false &&
                                //     _validatePassword == false) {
                                //   pr.show();
                                //   try {
                                //     final FirebaseAuth _firebaseAuth =
                                //         FirebaseAuth.instance;

                                //     AuthResult result = await _firebaseAuth
                                //         .signInWithEmailAndPassword(
                                //             email: _emailController.text,
                                //             password: _passController.text);
                                //     FirebaseUser user = result.user;
                                //     String userId = user.uid;

                                //     Navigator.of(context)
                                //         .popUntil((route) => route.isFirst);
                                //     Navigator.pushReplacement(
                                //             context,
                                //             MaterialPageRoute(
                                //                 builder: (BuildContext
                                //                         context) =>
                                //                     new PlantVitalsDashbaord()))
                                //         .then((value) {
                                //       pr.hide();
                                //     });
                                //   } catch (ex) {
                                //     pr.hide();

                                //     showDialog(
                                //         context: context,
                                //         builder: (BuildContext buildContext) {
                                //           return new AlertDialog(
                                //             title: new Text("Error"),
                                //             content: new Text(
                                //                 "An error has occured please try again later"),
                                //           );
                                //         });
                                //   }
                                // } else {
                                //   pr.hide();
                                // }
                                // Navigator.of(context)
                                //     .popUntil((route) => route.isFirst);
                                // Navigator.pushReplacement(
                                //     context,
                                //     MaterialPageRoute(
                                //         builder: (BuildContext context) =>
                                //             new PlantVitalsDashbaord()));
                                diseasenew("");
                              },
                              child: Center(
                                child: Text("LOGIN",
                                    style: TextStyle(
                                        color: Colors.white,
                                        fontFamily: "Poppins-Bold",
                                        fontSize: 18,
                                        letterSpacing: 1.0)),
                              ),
                            ),
                          ),
                        ),
                      )
                    ],
                  ),
                  // SizedBox(
                  //   height: ScreenUtil.getInstance().setHeight(40),
                  // ),
                  // Row(
                  //   mainAxisAlignment: MainAxisAlignment.center,
                  //   children: <Widget>[
                  //     horizontalLine(),
                  //     Text("Social Login",
                  //         style: TextStyle(
                  //             fontSize: 16.0, fontFamily: "Poppins-Medium")),
                  //     horizontalLine()
                  //   ],
                  // ),
                  // SizedBox(
                  //   height: ScreenUtil.getInstance().setHeight(40),
                  // ),
                  // Row(
                  //   mainAxisAlignment: MainAxisAlignment.center,
                  //   children: <Widget>[
                  //     SocialIcon(
                  //       colors: [
                  //         Color(0xFF102397),
                  //         Color(0xFF187adf),
                  //         Color(0xFF00eaf8),
                  //       ],
                  //       iconData: CustomIcons.facebook,
                  //       onPressed: () {},
                  //     ),
                  //     SocialIcon(
                  //       colors: [
                  //         Color(0xFFff4f38),
                  //         Color(0xFFff355d),
                  //       ],
                  //       iconData: CustomIcons.googlePlus,
                  //       onPressed: () {},
                  //     ),

                  //   ],
                  // ),
                  SizedBox(
                    height: ScreenUtil.getInstance().setHeight(30),
                  ),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: <Widget>[
                      Text(
                        "New User ? ",
                        style: TextStyle(
                            fontSize: 20, fontFamily: "Poppins-Medium"),
                      ),
                      InkWell(
                        onTap: () {
                          Navigator.of(context).pushReplacement(
                              MaterialPageRoute(
                                  builder: (BuildContext context) =>
                                      new SignUpScreen()));
                        },
                        child: Text("SignUp",
                            style: TextStyle(
                                fontSize: 20,
                                color: Color(0xFF1FC9A7),
                                fontFamily: "Poppins-Bold")),
                      )
                    ],
                  )
                ],
              ),
            ),
          )
        ],
      ),
    );
  }
}
