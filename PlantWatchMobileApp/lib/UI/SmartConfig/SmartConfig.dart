import 'package:smartconfig/smartconfig.dart';
import 'package:flutter/material.dart';
import 'dart:async';
import 'package:esptouch_flutter/esptouch_flutter.dart';

import 'package:flutter/services.dart';

class SmartConfig extends StatefulWidget {
  @override
  _SmartConfigState createState() => _SmartConfigState();
}

class _SmartConfigState extends State<SmartConfig> {
  @override
  void initState() {
    // TODO: implement initState
    super.initState();
    Smartconfig.start("HomeWifi", "e0:b5:5f:f4:0b:b0", "Oskar334")
        .then((onValue) {
      print("sm version $onValue");
    });
  }

  Future<void> initPlatformState() async {
    // Smartconfig.start("Kittenbot", "78:44:fd:72:7e:68", "kittenbot428")
    //     .then((onValue) {
    //   print("sm version $onValue");
    // });
    String platformVersion;
    // Platform messages may fail, so we use a try/catch PlatformException.
    try {
      // platformVersion = await Smartconfig.platformVersion;
    } on PlatformException {
      platformVersion = 'Failed to get platform version.';
    }

    // If the widget was removed from the tree while the asynchronous platform
    // message was in flight, we want to discard the reply rather than calling
    // setState to update our non-existent appearance.
    if (!mounted) return;

    setState(() {
      // _platformVersion = platformVersion;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Container();
  }
}
