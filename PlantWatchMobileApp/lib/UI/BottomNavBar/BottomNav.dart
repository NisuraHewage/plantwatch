import 'package:flutter/material.dart';
import '../PlantVitals/PlantVitals.dart';
import '../Devices/AddDevice.dart';
import '../Camera/take_pic.dart';
import '../Camera/DiseaseDetails.dart';

class BottomNav extends StatefulWidget {
  @override
  _BottomNavState createState() => _BottomNavState();
}

class _BottomNavState extends State<BottomNav> {
  int _currentIndex = 0;

  final List<Widget> _children = [
    PlantVitalsDashbaord(),
    CaptureImage(),
    DiseaseDetails()
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: _children[_currentIndex],
      bottomNavigationBar: BottomNavigationBar(
        onTap: (value) {
          setState(() {
            _currentIndex = value;
          });
        },
        selectedIconTheme: IconThemeData(color: Color(0xff16C7BD)),
        backgroundColor: Color(0xff2B3648),
        iconSize: 45,
        currentIndex:
            _currentIndex, // this will be set when a new tab is tapped
        items: [
          BottomNavigationBarItem(
            icon: new Icon(
              Icons.bar_chart,
              color: Color(0xff16C7BD),
            ),
            title: new Text(
              'Statistics',
              style: TextStyle(color: Color(0xff16C7BD)),
            ),
          ),
          BottomNavigationBarItem(
            icon: new Icon(Icons.camera_alt, color: Color(0xff16C7BD)),
            title: new Text(
              'Disease Finder',
              style: TextStyle(color: Color(0xff16C7BD)),
            ),
          ),
          BottomNavigationBarItem(
              icon: Icon(Icons.book, color: Color(0xff16C7BD)),
              title: Text(
                'Knowledge Base',
                style: TextStyle(color: Color(0xff16C7BD)),
              ))
        ],
      ),
    );
  }
}
