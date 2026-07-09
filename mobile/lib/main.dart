import 'dart:async';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';

void main() {
  runApp(const YoldaDriverApp());
}

class YoldaDriverApp extends StatelessWidget {
  const YoldaDriverApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: "YO'LDA Driver",
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        brightness: Brightness.light,
        scaffoldBackgroundColor: const Color(0xFFF8FAFC),
        primaryColor: const Color(0xFF0F172A),
        colorScheme: const ColorScheme.light(
          primary: Color(0xFF0F172A),
          secondary: Color(0xFF64748B),
          surface: Color(0xFFFFFFFF),
          background: Color(0xFFF8FAFC),
        ),
        textTheme: const TextTheme(
          bodyLarge: TextStyle(color: Color(0xFF0F172A), fontFamily: 'Roboto'),
          bodyMedium: TextStyle(color: Color(0xFF475569), fontFamily: 'Roboto'),
        ),
      ),
      home: const MainNavigationFlow(),
    );
  }
}

// Mock Car Model for Map & Booking
class MockCar {
  final String id;
  final String model;
  final String plate;
  final double x; // Local coordinates (0.0 to 1.0)
  final double y;
  final String charge;
  final String pricePerMin;
  final bool isElectric;

  MockCar({
    required this.id,
    required this.model,
    required this.plate,
    required this.x,
    required this.y,
    required this.charge,
    required this.pricePerMin,
    this.isElectric = false,
  });
}

// Screen Enum
enum DriverAppScreen {
  authPhone,
  authSms,
  mapBooking,
  preTripChecklist,
  activeTrip,
  postTripChecklist,
  tripSummary,
  supportChat
}

class MainNavigationFlow extends StatefulWidget {
  const MainNavigationFlow({Key? key}) : super(key: key);

  @override
  State<MainNavigationFlow> createState() => _MainNavigationFlowState();
}

class _MainNavigationFlowState extends State<MainNavigationFlow> {
  final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey<ScaffoldState>();
  String _filterType = 'all'; // 'all', 'electric', 'fuel'
  String _sortType = 'default'; // 'default', 'charge'

  List<MockCar> get _filteredCars {
    List<MockCar> list = List.from(_cars);
    if (_filterType == 'electric') {
      list = list.where((car) => car.isElectric).toList();
    } else if (_filterType == 'fuel') {
      list = list.where((car) => !car.isElectric).toList();
    }
    
    if (_sortType == 'charge') {
      list.sort((a, b) {
        int chargeA = int.tryParse(a.charge.replaceAll('%', '')) ?? 0;
        int chargeB = int.tryParse(b.charge.replaceAll('%', '')) ?? 0;
        return chargeB.compareTo(chargeA);
      });
    }
    return list;
  }

  DriverAppScreen _currentScreen = DriverAppScreen.authPhone;
  final TextEditingController _phoneController = TextEditingController(text: "+998 ");
  final TextEditingController _smsController = TextEditingController();
  final TextEditingController _chatInputController = TextEditingController();
  
  // Mock data
  final List<MockCar> _cars = [
    MockCar(id: "1", model: "BYD Song Plus EV", plate: "01 Z 885 ZZ", x: 0.35, y: 0.45, charge: "95%", pricePerMin: "1 500 сум", isElectric: true),
    MockCar(id: "2", model: "Chevrolet Cobalt LT", plate: "01 A 777 QA", x: 0.62, y: 0.32, charge: "64%", pricePerMin: "1 000 сум"),
    MockCar(id: "3", model: "Chevrolet Nexia 3", plate: "01 B 214 KX", x: 0.48, y: 0.68, charge: "82%", pricePerMin: "900 сум"),
    MockCar(id: "4", model: "Chevrolet Spark", plate: "01 H 552 MN", x: 0.72, y: 0.75, charge: "50%", pricePerMin: "800 сум"),
  ];

  MockCar? _selectedCar;
  
  // Pre-Trip Checklist State
  bool _cleanSalon = false;
  bool _noDamage = false;
  bool _tiresOk = false;

  // Pre-Trip Photo Inspection State
  bool _photoFront = false;
  bool _photoBack = false;
  bool _photoLeft = false;
  bool _photoRight = false;

  // Post-Trip Photo Inspection State
  bool _postPhotoFront = false;
  bool _postPhotoBack = false;
  bool _postPhotoLeft = false;
  bool _postPhotoRight = false;

  bool _postParkedOk = false;

  // Viewfinder navigation state
  String? _takingPhoto;
  String? _takingPostPhoto;

  // Active Trip State
  Timer? _tripTimer;
  int _secondsElapsed = 0;
  int _tripCost = 0;
  double _tripDistance = 0.0;
  
  // B2B User limit mock
  int _userSpent = 450000;
  final int _userLimit = 1500000;

  // Driver support messages list
  final List<Map<String, String>> _supportMessages = [
    {"sender": "driver", "text": "Здравствуйте! Не могу открыть двери у Cobalt.", "time": "10:30"},
    {"sender": "operator", "text": "Приветствуем! Попробуйте сдвинуть шторку или нажмите кнопку открытия в приложении.", "time": "10:32"},
    {"sender": "driver", "text": "В приложении пишет 'Двери заблокированы', кнопка не срабатывает. Помогите открыть.", "time": "10:35"},
  ];

  @override
  void dispose() {
    _tripTimer?.cancel();
    _phoneController.dispose();
    _smsController.dispose();
    _chatInputController.dispose();
    super.dispose();
  }

  void _showFilterBottomSheet() {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
      ),
      backgroundColor: Colors.white,
      builder: (BuildContext context) {
        return StatefulBuilder(
          builder: (BuildContext context, StateSetter setModalState) {
            return Padding(
              padding: const EdgeInsets.all(24.0),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text(
                        "Фильтр автопарка",
                        style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: Color(0xFF0F172A)),
                      ),
                      IconButton(
                        icon: const Icon(Icons.close),
                        onPressed: () => Navigator.pop(context),
                      )
                    ],
                  ),
                  const SizedBox(height: 20),
                  
                  const Text(
                    "Тип автомобиля",
                    style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: Color(0xFF64748B)),
                  ),
                  const SizedBox(height: 10),
                  Row(
                    children: [
                      Expanded(
                        child: _buildFilterChip(
                          label: "Все",
                          isSelected: _filterType == 'all',
                          onTap: () {
                            setModalState(() {
                              _filterType = 'all';
                            });
                          },
                        ),
                      ),
                      const SizedBox(width: 8),
                      Expanded(
                        child: _buildFilterChip(
                          label: "Электро",
                          isSelected: _filterType == 'electric',
                          onTap: () {
                            setModalState(() {
                              _filterType = 'electric';
                            });
                          },
                        ),
                      ),
                      const SizedBox(width: 8),
                      Expanded(
                        child: _buildFilterChip(
                          label: "ДВС",
                          isSelected: _filterType == 'fuel',
                          onTap: () {
                            setModalState(() {
                              _filterType = 'fuel';
                            });
                          },
                        ),
                      ),
                    ],
                  ),
                  
                  const SizedBox(height: 24),
                  
                  const Text(
                    "Сортировка",
                    style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: Color(0xFF64748B)),
                  ),
                  const SizedBox(height: 10),
                  Row(
                    children: [
                      Expanded(
                        child: _buildFilterChip(
                          label: "По умолчанию",
                          isSelected: _sortType == 'default',
                          onTap: () {
                            setModalState(() {
                              _sortType = 'default';
                            });
                          },
                        ),
                      ),
                      const SizedBox(width: 8),
                      Expanded(
                        child: _buildFilterChip(
                          label: "По заряду",
                          isSelected: _sortType == 'charge',
                          onTap: () {
                            setModalState(() {
                              _sortType = 'charge';
                            });
                          },
                        ),
                      ),
                    ],
                  ),
                  
                  const SizedBox(height: 32),
                  
                  ElevatedButton(
                    onPressed: () {
                      setState(() {});
                      Navigator.pop(context);
                      
                      String filterMsg = "Фильтр: ";
                      if (_filterType == 'all') filterMsg += "Все автомобили";
                      if (_filterType == 'electric') filterMsg += "Электромобили";
                      if (_filterType == 'fuel') filterMsg += "ДВС (Бензин/Газ)";
                      
                      if (_sortType == 'charge') filterMsg += " (сорт. по заряду)";
                      
                      _showNotification(filterMsg);
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF0F172A),
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15)),
                      elevation: 0,
                    ),
                    child: const Text(
                      "Применить",
                      style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15),
                    ),
                  ),
                ],
              ),
            );
          },
        );
      },
    );
  }

  Widget _buildFilterChip({required String label, required bool isSelected, required VoidCallback onTap}) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 12),
        decoration: BoxDecoration(
          color: isSelected ? const Color(0xFF0F172A) : const Color(0xFFF1F5F9),
          borderRadius: BorderRadius.circular(12),
          border: Border.all(
            color: isSelected ? const Color(0xFF0F172A) : const Color(0xFFE2E8F0),
          ),
        ),
        child: Text(
          label,
          textAlign: TextAlign.center,
          style: TextStyle(
            fontSize: 12,
            fontWeight: FontWeight.bold,
            color: isSelected ? Colors.white : const Color(0xFF475569),
          ),
        ),
      ),
    );
  }

  void _showTripHistoryDialog() {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
          title: const Text(
            "История поездок",
            style: TextStyle(fontWeight: FontWeight.bold, color: Color(0xFF0F172A)),
          ),
          content: SizedBox(
            width: double.maxFinite,
            child: ListView(
              shrinkWrap: true,
              children: [
                _buildTripHistoryItem("07 июля 2026", "BYD Song Plus EV", "01 Z 885 ZZ", "18 км · 42 мин", "84 000 сум"),
                _buildTripHistoryItem("06 июля 2026", "Chevrolet Cobalt LT", "01 A 777 QA", "34 км · 1ч 12мин", "72 000 сум"),
                _buildTripHistoryItem("04 июля 2026", "Chevrolet Nexia 3", "01 B 214 KX", "12 км · 25 мин", "22 500 сум"),
              ],
            ),
          ),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.pop(context);
              },
              child: const Text(
                "Закрыть",
                style: TextStyle(fontWeight: FontWeight.bold, color: Color(0xFF0F172A)),
              ),
            ),
          ],
        );
      },
    );
  }

  Widget _buildTripHistoryItem(String date, String model, String plate, String duration, String cost) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: const Color(0xFFF1F5F9),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: const Color(0xFFE2E8F0)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(date, style: const TextStyle(fontSize: 10, color: Color(0xFF64748B))),
              Text(cost, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFF0F172A))),
            ],
          ),
          const SizedBox(height: 6),
          Text(model, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: Color(0xFF0F172A))),
          const SizedBox(height: 2),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(plate, style: const TextStyle(fontSize: 11, fontFamily: 'monospace', color: Color(0xFF64748B))),
              Text(duration, style: const TextStyle(fontSize: 11, color: Color(0xFF64748B))),
            ],
          ),
        ],
      ),
    );
  }

  void _startTrip() {
    _secondsElapsed = 0;
    _tripCost = 0;
    _tripDistance = 0.0;
    _tripTimer = Timer.periodic(const Duration(seconds: 1), (timer) {
      setState(() {
        _secondsElapsed++;
        // Ticking cost: ~20 UZS per second (simulating B2B trip tariffs)
        _tripCost += 20;
        // Ticking distance: ~15 meters per second
        _tripDistance += 0.015;
      });
    });
  }

  void _endTrip() {
    _tripTimer?.cancel();
    setState(() {
      _userSpent += _tripCost;
    });
  }

  void _showNotification(String message, {bool isSuccess = true}) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Row(
          children: [
            Icon(
              isSuccess ? Icons.check_circle_outline : Icons.info_outline,
              color: isSuccess ? Colors.green : const Color(0xFF0F172A),
            ),
            const SizedBox(width: 10),
            Expanded(
              child: Text(
                message,
                style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Color(0xFF0F172A)),
              ),
            ),
          ],
        ),
        backgroundColor: const Color(0xFFF1F5F9),
        duration: const Duration(seconds: 3),
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15)),
      ),
    );
  }

  void _handleSendChatMessage() {
    final text = _chatInputController.text.trim();
    if (text.isEmpty) return;

    final timeString = "${DateTime.now().hour.toString().padLeft(2, '0')}:${DateTime.now().minute.toString().padLeft(2, '0')}";
    setState(() {
      _supportMessages.add({
        "sender": "driver",
        "text": text,
        "time": timeString,
      });
    });
    _chatInputController.clear();

    // Auto simulated reply from support operator
    Timer(const Duration(seconds: 2), () {
      if (!mounted) return;
      String operatorReply = "Принято в обработку. Специалист поддержки проверяет телеметрию вашего Cobalt.";
      if (text.toLowerCase().contains("двер") || text.toLowerCase().contains("открыть")) {
        operatorReply = "Телеметрия в порядке. Мы принудительно разблокировали центральный замок Cobalt. Проверьте двери.";
      } else if (text.toLowerCase().contains("спасибо")) {
        operatorReply = "Рады помочь! Желаем безопасной и комфортной поездки.";
      }

      setState(() {
        _supportMessages.add({
          "sender": "operator",
          "text": operatorReply,
          "time": "${DateTime.now().hour.toString().padLeft(2, '0')}:${DateTime.now().minute.toString().padLeft(2, '0')}",
        });
      });
    });
  }

  // Camera view overlay simulator widget
  Widget _buildCameraOverlay(String direction, bool isPreTrip) {
    return Scaffold(
      backgroundColor: Colors.black,
      body: Stack(
        children: [
          // Dashed vector outline boundary box
          Center(
            child: Container(
              width: 290,
              height: 380,
              decoration: BoxDecoration(
                border: Border.all(color: Colors.white60, width: 2, style: BorderStyle.solid),
                borderRadius: BorderRadius.circular(24),
              ),
              child: Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Icon(Icons.directions_car_filled_outlined, size: 90, color: Colors.white24),
                    const SizedBox(height: 20),
                    Text(
                      "Разместите кузов автомобиля в контуре\n(вид: $direction)",
                      textAlign: TextAlign.center,
                      style: const TextStyle(color: Colors.white54, fontSize: 11, leadingDistribution: TextLeadingDistribution.proportional),
                    ),
                  ],
                ),
              ),
            ),
          ),
          
          // Header instructions
          Positioned(
            top: 60,
            left: 24,
            right: 24,
            child: Column(
              children: [
                Text(
                  "КАМЕРА: ${direction.toUpperCase()}",
                  style: const TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold, letterSpacing: 1),
                ),
                const SizedBox(height: 6),
                const Text(
                  "Наведите камеру на указанную сторону автомобиля",
                  textAlign: TextAlign.center,
                  style: TextStyle(color: Colors.white70, fontSize: 11),
                ),
              ],
            ),
          ),
          
          // Bottom shutter click control
          Positioned(
            bottom: 50,
            left: 0,
            right: 0,
            child: Column(
              children: [
                GestureDetector(
                  onTap: () {
                    setState(() {
                      if (isPreTrip) {
                        if (direction == 'Спереди') _photoFront = true;
                        if (direction == 'Сзади') _photoBack = true;
                        if (direction == 'Слева') _photoLeft = true;
                        if (direction == 'Справа') _photoRight = true;
                        _takingPhoto = null;
                      } else {
                        if (direction == 'Спереди') _postPhotoFront = true;
                        if (direction == 'Сзади') _postPhotoBack = true;
                        if (direction == 'Слева') _postPhotoLeft = true;
                        if (direction == 'Справа') _postPhotoRight = true;
                        _takingPostPhoto = null;
                      }
                    });
                    _showNotification("Фото кузова ($direction) успешно сохранено!");
                  },
                  child: Container(
                    height: 76,
                    width: 76,
                    decoration: const BoxDecoration(
                      color: Colors.white,
                      shape: BoxShape.circle,
                    ),
                    padding: const EdgeInsets.all(4),
                    child: Container(
                      decoration: BoxDecoration(
                        border: Border.all(color: Colors.black, width: 3),
                        shape: BoxShape.circle,
                      ),
                    ),
                  ),
                ),
                const SizedBox(height: 16),
                TextButton(
                  onPressed: () {
                    setState(() {
                      if (isPreTrip) {
                        _takingPhoto = null;
                      } else {
                        _takingPostPhoto = null;
                      }
                    });
                  },
                  child: const Text("Отмена", style: TextStyle(color: Colors.white54, fontWeight: FontWeight.bold)),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  // Pre-trip / Post-trip photo inspection line helper
  Widget _buildPhotoInspectionItem(String direction, bool isCaptured, bool isPreTrip) {
    return GestureDetector(
      onTap: () {
        setState(() {
          if (isPreTrip) {
            _takingPhoto = direction;
          } else {
            _takingPostPhoto = direction;
          }
        });
      },
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        decoration: BoxDecoration(
          color: const Color(0xFFF1F5F9),
          borderRadius: BorderRadius.circular(15),
          border: Border.all(
            color: isCaptured ? const Color(0xFF0F172A) : const Color(0xFFE2E8F0),
            width: isCaptured ? 1.5 : 1.0,
          ),
        ),
        child: Row(
          children: [
            Icon(
              isCaptured ? Icons.check_circle : Icons.camera_alt_outlined,
              color: isCaptured ? Colors.green : const Color(0xFF64748B),
              size: 20,
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Text(
                "Фото кузова: $direction",
                style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Color(0xFF0F172A)),
              ),
            ),
            Text(
              isCaptured ? "Снято" : "Сделать фото",
              style: TextStyle(
                fontSize: 11,
                fontWeight: FontWeight.bold,
                color: isCaptured ? Colors.green : const Color(0xFF64748B),
              ),
            ),
          ],
        ),
      ),
    );
  }

  // Four diagnostic rounded blocks helper
  Widget _buildDiagnosticBlock(IconData icon, String value, String label) {
    return Container(
      width: 76,
      padding: const EdgeInsets.symmetric(vertical: 10),
      decoration: BoxDecoration(
        color: const Color(0xFFF1F5F9),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFFE2E8F0)),
      ),
      child: Column(
        children: [
          Icon(icon, size: 20, color: const Color(0xFF0F172A)),
          const SizedBox(height: 6),
          Text(
            value,
            style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFF0F172A)),
          ),
          const SizedBox(height: 2),
          Text(
            label,
            style: const TextStyle(fontSize: 8, color: Color(0xFF64748B)),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    if (_takingPhoto != null) {
      return _buildCameraOverlay(_takingPhoto!, true);
    }
    if (_takingPostPhoto != null) {
      return _buildCameraOverlay(_takingPostPhoto!, false);
    }

    switch (_currentScreen) {
      case DriverAppScreen.authPhone:
        return _buildAuthPhoneScreen();
      case DriverAppScreen.authSms:
        return _buildAuthSmsScreen();
      case DriverAppScreen.mapBooking:
        return _buildMapBookingScreen();
      case DriverAppScreen.preTripChecklist:
        return _buildPreTripChecklistScreen();
      case DriverAppScreen.activeTrip:
        return _buildActiveTripScreen();
      case DriverAppScreen.postTripChecklist:
        return _buildPostTripChecklistScreen();
      case DriverAppScreen.tripSummary:
        return _buildTripSummaryScreen();
      case DriverAppScreen.supportChat:
        return _buildSupportChatScreen();
    }
  }

  // 1. Phone Authentication Screen (Light Monochromatic)
  Widget _buildAuthPhoneScreen() {
    return Scaffold(
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 30),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const SizedBox(height: 60),
              Center(
                child: Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: const Color(0xFF0F172A).withOpacity(0.05),
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(
                    Icons.directions_car_filled_outlined,
                    size: 64,
                    color: Color(0xFF0F172A),
                  ),
                ),
              ),
              const SizedBox(height: 24),
              const Text(
                "YO'LDA Driver",
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: 28, fontWeight: FontWeight.w900, letterSpacing: -0.5),
              ),
              const SizedBox(height: 8),
              const Text(
                "Корпоративный каршеринг в Узбекистане",
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: 14, color: Color(0xFF64748B)),
              ),
              const SizedBox(height: 60),
              const Text(
                "Номер телефона",
                style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: Color(0xFF475569)),
              ),
              const SizedBox(height: 8),
              TextField(
                controller: _phoneController,
                keyboardType: TextInputType.phone,
                style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: Color(0xFF0F172A)),
                decoration: InputDecoration(
                  hintText: "+998 90 123-45-67",
                  hintStyle: const TextStyle(color: Colors.black38),
                  filled: true,
                  fillColor: const Color(0xFFF1F5F9),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(15),
                    borderSide: BorderSide.none,
                  ),
                  contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
                ),
              ),
              const Spacer(),
              ElevatedButton(
                onPressed: () {
                  if (_phoneController.text.trim().length < 9) {
                    _showNotification("Введите корректный номер телефона!", isSuccess: false);
                    return;
                  }
                  setState(() {
                    _currentScreen = DriverAppScreen.authSms;
                  });
                  _showNotification("Код подтверждения: 1234", isSuccess: false);
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF0F172A),
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15)),
                  elevation: 0,
                ),
                child: const Text("Получить код", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15)),
              ),
            ],
          ),
        ),
      ),
    );
  }

  // 2. SMS OTP Verification Screen (Light Monochromatic)
  Widget _buildAuthSmsScreen() {
    return Scaffold(
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Color(0xFF0F172A)),
          onPressed: () {
            setState(() {
              _currentScreen = DriverAppScreen.authPhone;
            });
          },
        ),
        backgroundColor: Colors.transparent,
        elevation: 0,
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 10),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const Text(
                "Код из СМС",
                style: TextStyle(fontSize: 24, fontWeight: FontWeight.w900, letterSpacing: -0.5),
              ),
              const SizedBox(height: 8),
              Text(
                "Мы отправили одноразовый код на номер ${_phoneController.text}",
                style: const TextStyle(fontSize: 14, color: Color(0xFF64748B)),
              ),
              const SizedBox(height: 40),
              TextField(
                controller: _smsController,
                keyboardType: TextInputType.number,
                textAlign: TextAlign.center,
                maxLength: 4,
                style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 24, letterSpacing: 8, fontFamily: 'monospace', color: Color(0xFF0F172A)),
                decoration: InputDecoration(
                  counterText: "",
                  hintText: "••••",
                  hintStyle: const TextStyle(color: Colors.black26),
                  filled: true,
                  fillColor: const Color(0xFFF1F5F9),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(15),
                    borderSide: BorderSide.none,
                  ),
                  contentPadding: const EdgeInsets.symmetric(vertical: 16),
                ),
              ),
              const Spacer(),
              ElevatedButton(
                onPressed: () {
                  if (_smsController.text != "1234") {
                    _showNotification("Неверный СМС код! Введите 1234", isSuccess: false);
                    return;
                  }
                  setState(() {
                    _currentScreen = DriverAppScreen.mapBooking;
                  });
                  _showNotification("Успешная авторизация в Uzum Market B2B");
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF0F172A),
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15)),
                  elevation: 0,
                ),
                child: const Text("Войти", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15)),
              ),
            ],
          ),
        ),
      ),
    );
  }

  // 3. Map Dashboard & Selected Car Panel Screen (Light Monochromatic with Menu and Filters)
  Widget _buildMapBookingScreen() {
    double limitPercent = _userSpent / _userLimit;
    if (limitPercent > 1.0) limitPercent = 1.0;

    return Scaffold(
      key: _scaffoldKey,
      drawer: Drawer(
        backgroundColor: const Color(0xFFF8FAFC),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            UserAccountsDrawerHeader(
              decoration: const BoxDecoration(
                color: Color(0xFF0F172A),
              ),
              currentAccountPicture: CircleAvatar(
                backgroundColor: Colors.white,
                child: const Text(
                  "АЮ",
                  style: TextStyle(
                    fontSize: 22,
                    fontWeight: FontWeight.bold,
                    color: Color(0xFF0F172A),
                  ),
                ),
              ),
              accountName: const Text(
                "Александр Юсупов",
                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
              ),
              accountEmail: Row(
                children: const [
                  Icon(Icons.star, color: Colors.amber, size: 16),
                  SizedBox(width: 4),
                  Text(
                    "4.95 · Личный водитель",
                    style: TextStyle(color: Colors.white70, fontSize: 12),
                  ),
                ],
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(16.0),
              child: Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: const Color(0xFFE2E8F0)),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: const [
                        Icon(Icons.business, color: Color(0xFF0F172A), size: 18),
                        SizedBox(width: 8),
                        Text(
                          "ООО «Uzum Market»",
                          style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Color(0xFF0F172A)),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text("Лимит B2B:", style: TextStyle(fontSize: 12, color: Color(0xFF64748B))),
                        Text(
                          "${NumberFormat('#,##0', 'ru').format(_userLimit)} сум",
                          style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFF0F172A)),
                        ),
                      ],
                    ),
                    const SizedBox(height: 4),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text("Доступно:", style: TextStyle(fontSize: 12, color: Color(0xFF64748B))),
                        Text(
                          "${NumberFormat('#,##0', 'ru').format(_userLimit - _userSpent)} сум",
                          style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.green),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
            const Divider(),
            ListTile(
              leading: const Icon(Icons.map_outlined, color: Color(0xFF0F172A)),
              title: const Text("Карта и бронирование", style: TextStyle(fontWeight: FontWeight.bold, color: Color(0xFF0F172A))),
              onTap: () {
                Navigator.pop(context);
              },
            ),
            ListTile(
              leading: const Icon(Icons.history, color: Color(0xFF0F172A)),
              title: const Text("История поездок", style: TextStyle(fontWeight: FontWeight.bold, color: Color(0xFF0F172A))),
              onTap: () {
                Navigator.pop(context);
                _showTripHistoryDialog();
              },
            ),
            ListTile(
              leading: const Icon(Icons.chat_bubble_outline, color: Color(0xFF0F172A)),
              title: const Text("Служба поддержки", style: TextStyle(fontWeight: FontWeight.bold, color: Color(0xFF0F172A))),
              onTap: () {
                Navigator.pop(context);
                setState(() {
                  _currentScreen = DriverAppScreen.supportChat;
                });
              },
            ),
            const Spacer(),
            const Divider(),
            ListTile(
              leading: const Icon(Icons.logout, color: Colors.redAccent),
              title: const Text("Выйти из аккаунта", style: TextStyle(fontWeight: FontWeight.bold, color: Colors.redAccent)),
              onTap: () {
                Navigator.pop(context);
                setState(() {
                  _currentScreen = DriverAppScreen.authPhone;
                });
              },
            ),
            const SizedBox(height: 20),
          ],
        ),
      ),
      body: Stack(
        children: [
          // Real Interactive Map (OpenStreetMap with Leaflet)
          Positioned.fill(
            child: FlutterMap(
              options: MapOptions(
                initialCenter: LatLng(41.311081, 69.240562),
                initialZoom: 13.0,
                onTap: (tapPosition, point) {
                  setState(() {
                    _selectedCar = null;
                  });
                },
              ),
              children: [
                TileLayer(
                  urlTemplate: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
                  userAgentPackageName: 'com.example.yolda',
                ),
                MarkerLayer(
                  markers: _filteredCars.map((car) {
                    final isSelected = _selectedCar?.id == car.id;
                    // Map relative coords (0.0 to 1.0) to Tashkent LatLng
                    double lat = 41.34 - (car.y * 0.06);
                    double lng = 69.20 + (car.x * 0.08);

                    return Marker(
                      point: LatLng(lat, lng),
                      width: 50,
                      height: 50,
                      child: GestureDetector(
                        onTap: () {
                          setState(() {
                            _selectedCar = car;
                          });
                        },
                        child: Stack(
                          alignment: Alignment.center,
                          children: [
                            if (isSelected)
                              Container(
                                width: 44,
                                height: 44,
                                decoration: BoxDecoration(
                                  color: const Color(0xFF0F172A).withOpacity(0.15),
                                  shape: BoxShape.circle,
                                ),
                              ),
                            Container(
                              width: 20,
                              height: 20,
                              decoration: BoxDecoration(
                                color: isSelected ? const Color(0xFF0F172A) : const Color(0xFFCBD5E1),
                                shape: BoxShape.circle,
                                border: Border.all(color: Colors.white, width: 2),
                                boxShadow: [
                                  BoxShadow(
                                    color: Colors.black.withOpacity(0.2),
                                    blurRadius: 4,
                                    offset: const Offset(0, 2),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ),
                    );
                  }).toList(),
                ),
              ],
            ),
          ),

          // Top Header Bar with Menu, B2B Balance Pill, and Filter
          Positioned(
            top: 50,
            left: 16,
            right: 16,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                // Hamburger Menu Button
                GestureDetector(
                  onTap: () {
                    _scaffoldKey.currentState?.openDrawer();
                  },
                  child: Container(
                    height: 44,
                    width: 44,
                    decoration: BoxDecoration(
                      color: Colors.white,
                      shape: BoxShape.circle,
                      border: Border.all(color: const Color(0xFFE2E8F0)),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withOpacity(0.06),
                          blurRadius: 10,
                          offset: const Offset(0, 4),
                        ),
                      ],
                    ),
                    child: const Icon(Icons.menu, color: Color(0xFF0F172A), size: 20),
                  ),
                ),
                
                // Corporate Balance Pill
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(30),
                    border: Border.all(color: const Color(0xFFE2E8F0)),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.06),
                        blurRadius: 10,
                        offset: const Offset(0, 4),
                      ),
                    ],
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const Icon(Icons.business, color: Color(0xFF0F172A), size: 16),
                      const SizedBox(width: 6),
                      const Text(
                        "Uzum Market",
                        style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: Color(0xFF0F172A)),
                      ),
                      const SizedBox(width: 6),
                      Container(
                        width: 1.5,
                        height: 12,
                        color: const Color(0xFFCBD5E1),
                      ),
                      const SizedBox(width: 6),
                      Text(
                        "${NumberFormat('#,##0', 'ru').format(_userLimit - _userSpent)} сум",
                        style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: Color(0xFF64748B)),
                      ),
                    ],
                  ),
                ),
                
                // Filter Button
                GestureDetector(
                  onTap: () {
                    _showFilterBottomSheet();
                  },
                  child: Container(
                    height: 44,
                    width: 44,
                    decoration: BoxDecoration(
                      color: Colors.white,
                      shape: BoxShape.circle,
                      border: Border.all(color: const Color(0xFFE2E8F0)),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withOpacity(0.06),
                          blurRadius: 10,
                          offset: const Offset(0, 4),
                        ),
                      ],
                    ),
                    child: const Icon(Icons.tune, color: Color(0xFF0F172A), size: 20),
                  ),
                ),
              ],
            ),
          ),

          // Floating Action Button for Support Chat
          if (_selectedCar == null)
            Positioned(
              bottom: 24,
              right: 16,
              child: FloatingActionButton(
                onPressed: () {
                  setState(() {
                    _currentScreen = DriverAppScreen.supportChat;
                  });
                },
                backgroundColor: const Color(0xFF0F172A),
                child: const Icon(Icons.chat_bubble_outline, color: Colors.white),
              ),
            ),

          // Bottom Sheet Detail Card when Car is Selected (With 4 Diagnostic Blocks)
          if (_selectedCar != null)
            Positioned(
              bottom: 24,
              left: 16,
              right: 16,
              child: Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(28),
                  border: Border.all(color: const Color(0xFFE2E8F0), width: 1.5),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.08),
                      blurRadius: 15,
                      offset: const Offset(0, 6),
                    ),
                  ],
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    // Header info
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              _selectedCar!.model,
                              style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: Color(0xFF0F172A)),
                            ),
                            const SizedBox(height: 4),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 3),
                              decoration: BoxDecoration(
                                color: const Color(0xFFF1F5F9),
                                border: Border.all(color: const Color(0xFFE2E8F0)),
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: Text(
                                _selectedCar!.plate,
                                style: const TextStyle(fontSize: 11, fontFamily: 'monospace', fontWeight: FontWeight.bold, color: Color(0xFF0F172A)),
                              ),
                            )
                          ],
                        ),
                        // Price tag
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.end,
                          children: [
                            Text(
                              "${_selectedCar!.pricePerMin}/мин",
                              style: const TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: Color(0xFF0F172A)),
                            ),
                            const Text(
                              "минута аренды",
                              style: TextStyle(fontSize: 9, color: Color(0xFF64748B)),
                            ),
                          ],
                        ),
                      ],
                    ),
                    const SizedBox(height: 20),
                    
                    // 4 Diagnostic rounded blocks
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        // Block 1: Fuel/Charge
                        _buildDiagnosticBlock(
                          _selectedCar!.isElectric ? Icons.battery_charging_full_outlined : Icons.local_gas_station_outlined,
                          _selectedCar!.charge,
                          _selectedCar!.isElectric ? "Заряд" : "Топливо",
                        ),
                        // Block 2: Gearbox
                        _buildDiagnosticBlock(
                          Icons.settings_outlined,
                          "Автомат",
                          "КПП",
                        ),
                        // Block 3: Seats
                        _buildDiagnosticBlock(
                          Icons.people_outline,
                          _selectedCar!.model.contains("Spark") ? "4 места" : "5 мест",
                          "Салон",
                        ),
                        // Block 4: Climate
                        _buildDiagnosticBlock(
                          Icons.ac_unit_outlined,
                          "Есть",
                          "Климат",
                        ),
                      ],
                    ),
                    const SizedBox(height: 20),

                    // Corporate B2B banner
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                      decoration: BoxDecoration(
                        color: const Color(0xFFE8F5E9),
                        borderRadius: BorderRadius.circular(15),
                        border: Border.all(color: const Color(0xFFC8E6C9)),
                      ),
                      child: Row(
                        children: [
                          const Icon(Icons.business_outlined, color: Color(0xFF2E7D32), size: 20),
                          const SizedBox(width: 10),
                          Expanded(
                            child: const Text(
                              "Корпоративный тариф / Списание с баланса ООО «Uzum Market»",
                              style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Color(0xFF2E7D32), height: 1.3),
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 20),

                    // Action buttons
                    Row(
                      children: [
                        Expanded(
                          child: OutlinedButton(
                            onPressed: () {
                              setState(() {
                                _selectedCar = null;
                              });
                            },
                            style: OutlinedButton.styleFrom(
                              side: const BorderSide(color: Color(0xFFE2E8F0)),
                              padding: const EdgeInsets.symmetric(vertical: 16),
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15)),
                            ),
                            child: const Text("Отмена", style: TextStyle(color: Color(0xFF475569), fontWeight: FontWeight.bold)),
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: ElevatedButton(
                            onPressed: () {
                              setState(() {
                                _cleanSalon = false;
                                _noDamage = false;
                                _tiresOk = false;
                                _photoFront = false;
                                _photoBack = false;
                                _photoLeft = false;
                                _photoRight = false;
                                _currentScreen = DriverAppScreen.preTripChecklist;
                              });
                            },
                            style: ElevatedButton.styleFrom(
                              backgroundColor: const Color(0xFF0F172A),
                              foregroundColor: Colors.white,
                              padding: const EdgeInsets.symmetric(vertical: 16),
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15)),
                              elevation: 0,
                            ),
                            child: const Text("Забронировать", style: TextStyle(fontWeight: FontWeight.bold)),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
        ],
      ),
    );
  }

  // 4. Pre-Trip Inspection Checklist Screen (Light Monochromatic + Photos)
  Widget _buildPreTripChecklistScreen() {
    bool canStart = _cleanSalon && _noDamage && _tiresOk && _photoFront && _photoBack && _photoLeft && _photoRight;

    return Scaffold(
      appBar: AppBar(
        title: const Text("Осмотр автомобиля", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: Color(0xFF0F172A))),
        centerTitle: true,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Color(0xFF0F172A)),
          onPressed: () => setState(() => _currentScreen = DriverAppScreen.mapBooking),
        ),
        backgroundColor: Colors.transparent,
        elevation: 0,
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 10),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Text(
                "Перед поездкой на ${_selectedCar?.model ?? ''}",
                style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: Color(0xFF0F172A)),
              ),
              const SizedBox(height: 6),
              const Text(
                "Выполните обязательный фотоосмотр кузова с 4 сторон и подтвердите чек-лист.",
                style: TextStyle(fontSize: 13, color: Color(0xFF64748B)),
              ),
              const SizedBox(height: 24),
              
              // Photo Grid List
              _buildPhotoInspectionItem("Спереди", _photoFront, true),
              const SizedBox(height: 8),
              _buildPhotoInspectionItem("Сзади", _photoBack, true),
              const SizedBox(height: 8),
              _buildPhotoInspectionItem("Слева", _photoLeft, true),
              const SizedBox(height: 8),
              _buildPhotoInspectionItem("Справа", _photoRight, true),
              const SizedBox(height: 16),
              const Divider(color: Color(0xFFE2E8F0)),
              
              // Checklist checkboxes
              CheckboxListTile(
                value: _cleanSalon,
                activeColor: const Color(0xFF0F172A),
                title: const Text("Салон чистый", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Color(0xFF0F172A))),
                subtitle: const Text("Внутри нет мусора и посторонних вещей", style: TextStyle(fontSize: 10, color: Color(0xFF64748B))),
                onChanged: (val) => setState(() => _cleanSalon = val ?? false),
                contentPadding: EdgeInsets.zero,
              ),
              CheckboxListTile(
                value: _noDamage,
                activeColor: const Color(0xFF0F172A),
                title: const Text("Новые повреждения отсутствуют", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Color(0xFF0F172A))),
                subtitle: const Text("Вмятины и сколы не обнаружены", style: TextStyle(fontSize: 10, color: Color(0xFF64748B))),
                onChanged: (val) => setState(() => _noDamage = val ?? false),
                contentPadding: EdgeInsets.zero,
              ),
              CheckboxListTile(
                value: _tiresOk,
                activeColor: const Color(0xFF0F172A),
                title: const Text("Колеса и шины целые", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Color(0xFF0F172A))),
                subtitle: const Text("Давление в норме, нет проколов и спущенности", style: TextStyle(fontSize: 10, color: Color(0xFF64748B))),
                onChanged: (val) => setState(() => _tiresOk = val ?? false),
                contentPadding: EdgeInsets.zero,
              ),

              const Spacer(),
              Row(
                children: [
                  Expanded(
                    child: OutlinedButton(
                      onPressed: () {
                        setState(() {
                          _currentScreen = DriverAppScreen.mapBooking;
                        });
                      },
                      style: OutlinedButton.styleFrom(
                        side: const BorderSide(color: Color(0xFFE2E8F0)),
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15)),
                      ),
                      child: const Text("Отмена", style: TextStyle(color: Color(0xFF475569))),
                    ),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: ElevatedButton(
                      onPressed: canStart ? () {
                        _startTrip();
                        setState(() {
                          _currentScreen = DriverAppScreen.activeTrip;
                        });
                        _showNotification("Поездка на ${_selectedCar!.model} началась!");
                      } : null,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF0F172A),
                        disabledBackgroundColor: const Color(0xFFF1F5F9),
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15)),
                        elevation: 0,
                      ),
                      child: const Text("Начать поездку", style: TextStyle(fontWeight: FontWeight.bold)),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  // 4b. Post-Trip Inspection Checklist Screen (Light Monochromatic)
  Widget _buildPostTripChecklistScreen() {
    bool canFinish = _postParkedOk && _postPhotoFront && _postPhotoBack && _postPhotoLeft && _postPhotoRight;

    return Scaffold(
      appBar: AppBar(
        title: const Text("Завершение поездки", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: Color(0xFF0F172A))),
        centerTitle: true,
        backgroundColor: Colors.transparent,
        elevation: 0,
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 10),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const Text(
                "Фотоосмотр после поездки",
                style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: Color(0xFF0F172A)),
              ),
              const SizedBox(height: 6),
              const Text(
                "Сделайте фотографии автомобиля с 4 сторон, чтобы подтвердить сохранность кузова.",
                style: TextStyle(fontSize: 13, color: Color(0xFF64748B)),
              ),
              const SizedBox(height: 24),
              
              // Post-Trip Photo Checklist
              _buildPhotoInspectionItem("Спереди", _postPhotoFront, false),
              const SizedBox(height: 8),
              _buildPhotoInspectionItem("Сзади", _postPhotoBack, false),
              const SizedBox(height: 8),
              _buildPhotoInspectionItem("Слева", _postPhotoLeft, false),
              const SizedBox(height: 8),
              _buildPhotoInspectionItem("Справа", _postPhotoRight, false),
              const SizedBox(height: 16),
              const Divider(color: Color(0xFFE2E8F0)),
              
              // Parking Rule Checkbox
              CheckboxListTile(
                value: _postParkedOk,
                activeColor: const Color(0xFF0F172A),
                title: const Text("Автомобиль припаркован по правилам", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Color(0xFF0F172A))),
                subtitle: const Text("Не мешает проезду, припаркован в соответствии с ПДД", style: TextStyle(fontSize: 10, color: Color(0xFF64748B))),
                onChanged: (val) => setState(() => _postParkedOk = val ?? false),
                contentPadding: EdgeInsets.zero,
              ),

              const Spacer(),
              Row(
                children: [
                  Expanded(
                    child: OutlinedButton(
                      onPressed: () {
                        setState(() {
                          _currentScreen = DriverAppScreen.activeTrip;
                        });
                      },
                      style: OutlinedButton.styleFrom(
                        side: const BorderSide(color: Color(0xFFE2E8F0)),
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15)),
                      ),
                      child: const Text("Назад", style: TextStyle(color: Color(0xFF475569))),
                    ),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: ElevatedButton(
                      onPressed: canFinish ? () {
                        _endTrip();
                        setState(() {
                          _currentScreen = DriverAppScreen.tripSummary;
                        });
                        _showNotification("Поездка успешно завершена!");
                      } : null,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.redAccent,
                        disabledBackgroundColor: const Color(0xFFF1F5F9),
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15)),
                        elevation: 0,
                      ),
                      child: const Text("Завершить", style: TextStyle(fontWeight: FontWeight.bold)),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  // 5. Active Trip Dashboard with Live Counters & Vehicle Remote Control (Light Monochromatic)
  Widget _buildActiveTripScreen() {
    final duration = Duration(seconds: _secondsElapsed);
    final hours = duration.inHours.toString().padLeft(2, '0');
    final minutes = (duration.inMinutes % 60).toString().padLeft(2, '0');
    final seconds = (duration.inSeconds % 60).toString().padLeft(2, '0');

    return Scaffold(
      body: Stack(
        children: [
          Positioned.fill(
            child: Padding(
              padding: const EdgeInsets.all(24.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  const SizedBox(height: 40),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Row(
                        children: [
                          Icon(
                            _selectedCar?.isElectric == true ? Icons.flash_on : Icons.local_gas_station_outlined, 
                            color: const Color(0xFF0F172A), 
                            size: 18,
                          ),
                          const SizedBox(width: 6),
                          Text(
                            _selectedCar?.model ?? '',
                            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: Color(0xFF0F172A)),
                          ),
                        ],
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                        decoration: BoxDecoration(
                          color: Colors.redAccent.withOpacity(0.15),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: const Text(
                          "АРЕНДА",
                          style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Colors.redAccent),
                        ),
                      )
                    ],
                  ),
                  const SizedBox(height: 40),
                  
                  // Live Ticking Time Counter
                  const Text(
                    "Время в поездке",
                    textAlign: TextAlign.center,
                    style: TextStyle(fontSize: 12, color: Color(0xFF64748B)),
                  ),
                  const SizedBox(height: 6),
                  Text(
                    "$hours:$minutes:$seconds",
                    textAlign: TextAlign.center,
                    style: const TextStyle(fontSize: 48, fontWeight: FontWeight.w900, fontFamily: 'monospace', letterSpacing: -1, color: Color(0xFF0F172A)),
                  ),
                  const SizedBox(height: 24),
                  
                  // Live Ticking Cost Counter
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Text("Стоимость: ", style: TextStyle(fontSize: 14, color: Color(0xFF64748B))),
                      Text(
                        "${NumberFormat('#,##0', 'ru').format(_tripCost)} сум",
                        style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Color(0xFF0F172A)),
                      ),
                    ],
                  ),
                  const SizedBox(height: 40),

                  // Simulated Vehicle Telemetry Stats Panel (3 Metrics blocks)
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: const Color(0xFFF1F5F9),
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(color: const Color(0xFFE2E8F0)),
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceAround,
                      children: [
                        Column(
                          children: [
                            const Icon(Icons.speed, color: Color(0xFF64748B), size: 20),
                            const SizedBox(height: 6),
                            const Text("Скорость", style: TextStyle(fontSize: 10, color: Color(0xFF64748B))),
                            const SizedBox(height: 2),
                            Text(
                              _secondsElapsed > 2 ? "62 км/ч" : "0 км/ч",
                              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Color(0xFF0F172A)),
                            ),
                          ],
                        ),
                        Column(
                          children: [
                            Icon(
                              _selectedCar?.isElectric == true ? Icons.battery_charging_full_outlined : Icons.local_gas_station_outlined,
                              color: const Color(0xFF64748B),
                              size: 20,
                            ),
                            const SizedBox(height: 6),
                            Text(
                              _selectedCar?.isElectric == true ? "Зарядка" : "Топливо",
                              style: const TextStyle(fontSize: 10, color: Color(0xFF64748B)),
                            ),
                            const SizedBox(height: 2),
                            Text(
                              _selectedCar?.charge ?? '',
                              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Color(0xFF0F172A)),
                            ),
                          ],
                        ),
                        Column(
                          children: [
                            const Icon(Icons.social_distance_outlined, color: Color(0xFF64748B), size: 20),
                            const SizedBox(height: 6),
                            const Text("Дистанция", style: TextStyle(fontSize: 10, color: Color(0xFF64748B))),
                            const SizedBox(height: 2),
                            Text(
                              "${_tripDistance.toStringAsFixed(2)} км",
                              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Color(0xFF0F172A)),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 32),

                  // Remote Central Lock Controls
                  const Text(
                    "Управление замками и звуком",
                    style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFF64748B)),
                  ),
                  const SizedBox(height: 10),
                  Row(
                    children: [
                      Expanded(
                        child: ElevatedButton.icon(
                          onPressed: () => _showNotification("Двери заблокированы!"),
                          icon: const Icon(Icons.lock, size: 16),
                          label: const Text("Закрыть"),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: const Color(0xFFF1F5F9),
                            foregroundColor: const Color(0xFF0F172A),
                            padding: const EdgeInsets.symmetric(vertical: 12),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                            elevation: 0,
                          ),
                        ),
                      ),
                      const SizedBox(width: 8),
                      Expanded(
                        child: ElevatedButton.icon(
                          onPressed: () => _showNotification("Двери разблокированы!"),
                          icon: const Icon(Icons.lock_open, size: 16),
                          label: const Text("Открыть"),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: const Color(0xFFF1F5F9),
                            foregroundColor: const Color(0xFF0F172A),
                            padding: const EdgeInsets.symmetric(vertical: 12),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                            elevation: 0,
                          ),
                        ),
                      ),
                      const SizedBox(width: 8),
                      Expanded(
                        child: ElevatedButton.icon(
                          onPressed: () => _showNotification("Гудок отправлен на авто!"),
                          icon: const Icon(Icons.volume_up, size: 16),
                          label: const Text("Гудок"),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: const Color(0xFFF1F5F9),
                            foregroundColor: const Color(0xFF0F172A),
                            padding: const EdgeInsets.symmetric(vertical: 12),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                            elevation: 0,
                          ),
                        ),
                      ),
                    ],
                  ),

                  const Spacer(),
                  ElevatedButton(
                    onPressed: () {
                      setState(() {
                        _postPhotoFront = false;
                        _postPhotoBack = false;
                        _postPhotoLeft = false;
                        _postPhotoRight = false;
                        _postParkedOk = false;
                        _currentScreen = DriverAppScreen.postTripChecklist;
                      });
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.redAccent,
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15)),
                      elevation: 0,
                    ),
                    child: const Text("Завершить поездку", style: TextStyle(fontWeight: FontWeight.bold)),
                  ),
                ],
              ),
            ),
          ),
          
          // Chat Floating Icon in Active Trip
          Positioned(
            top: 60,
            right: 24,
            child: GestureDetector(
              onTap: () {
                setState(() {
                  _currentScreen = DriverAppScreen.supportChat;
                });
              },
              child: Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: const Color(0xFF0F172A),
                  shape: BoxShape.circle,
                  boxShadow: [
                    BoxShadow(color: Colors.black.withOpacity(0.15), blurRadius: 6),
                  ],
                ),
                child: const Icon(Icons.chat_bubble_outline, color: Colors.white, size: 20),
              ),
            ),
          )
        ],
      ),
    );
  }

  // 6. Final Summary Screen with Bill/Receipt (Light Monochromatic)
  Widget _buildTripSummaryScreen() {
    final duration = Duration(seconds: _secondsElapsed);
    final minutes = duration.inMinutes.toString();
    final seconds = (duration.inSeconds % 60).toString();

    return Scaffold(
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const SizedBox(height: 40),
              Center(
                child: Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: const Color(0xFF0F172A).withOpacity(0.08),
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(
                    Icons.done_all,
                    size: 48,
                    color: Color(0xFF0F172A),
                  ),
                ),
              ),
              const SizedBox(height: 24),
              const Text(
                "Поездка успешно завершена!",
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: Color(0xFF0F172A)),
              ),
              const SizedBox(height: 6),
              const Text(
                "Сумма списана с корпоративного счета компании",
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: 12, color: Color(0xFF64748B)),
              ),
              const SizedBox(height: 40),
              
              // Bill breakdown
              Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: const Color(0xFFF1F5F9),
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: const Color(0xFFE2E8F0)),
                ),
                child: Column(
                  children: [
                    _buildBillRow("Автомобиль", _selectedCar?.model ?? ''),
                    const Divider(color: Colors.black12),
                    _buildBillRow("Время аренды", "$minutes мин $seconds сек"),
                    const Divider(color: Colors.black12),
                    _buildBillRow("Пройденная дистанция", "${_tripDistance.toStringAsFixed(2)} км"),
                    const Divider(color: Colors.black12),
                    _buildBillRow(
                      "Стоимость поездки", 
                      "${NumberFormat('#,##0', 'ru').format(_tripCost)} сум",
                      isCost: true
                    ),
                  ],
                ),
              ),
              const Spacer(),
              ElevatedButton(
                onPressed: () {
                  setState(() {
                    _selectedCar = null;
                    _currentScreen = DriverAppScreen.mapBooking;
                  });
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF0F172A),
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15)),
                  elevation: 0,
                ),
                child: const Text("На главную", style: TextStyle(fontWeight: FontWeight.bold)),
              ),
            ],
          ),
        ),
      ),
    );
  }

  // 7. Live Driver-Operator Support Chat Screen (Light Monochromatic)
  Widget _buildSupportChatScreen() {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Служба поддержки", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: Color(0xFF0F172A))),
        centerTitle: true,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Color(0xFF0F172A)),
          onPressed: () {
            setState(() {
              // Return to active trip if we were in a trip, or map booking
              if (_tripTimer != null && _tripTimer!.isActive) {
                _currentScreen = DriverAppScreen.activeTrip;
              } else {
                _currentScreen = DriverAppScreen.mapBooking;
              }
            });
          },
        ),
        backgroundColor: Colors.transparent,
        elevation: 0,
      ),
      body: SafeArea(
        child: Column(
          children: [
            Expanded(
              child: ListView.builder(
                padding: const EdgeInsets.all(16),
                itemCount: _supportMessages.length,
                itemBuilder: (context, index) {
                  final msg = _supportMessages[index];
                  final isDriver = msg["sender"] == "driver";
                  return Align(
                    alignment: isDriver ? Alignment.centerRight : Alignment.centerLeft,
                    child: Container(
                      margin: const EdgeInsets.symmetric(vertical: 6),
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: isDriver ? const Color(0xFF0F172A) : const Color(0xFFF1F5F9),
                        borderRadius: BorderRadius.only(
                          topLeft: const Radius.circular(16),
                          topRight: const Radius.circular(16),
                          bottomLeft: isDriver ? const Radius.circular(16) : Radius.zero,
                          bottomRight: isDriver ? Radius.zero : const Radius.circular(16),
                        ),
                      ),
                      constraints: BoxConstraints(maxWidth: MediaQuery.of(context).size.width * 0.75),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            msg["text"] ?? '',
                            style: TextStyle(
                              fontSize: 13, 
                              color: isDriver ? Colors.white : const Color(0xFF0F172A),
                              leadingDistribution: TextLeadingDistribution.proportional
                            ),
                          ),
                          const SizedBox(height: 4),
                          Align(
                            alignment: Alignment.bottomRight,
                            child: Text(
                              msg["time"] ?? '',
                              style: TextStyle(fontSize: 9, color: isDriver ? Colors.white70 : Colors.black45, fontFamily: 'monospace'),
                            ),
                          ),
                        ],
                      ),
                    ),
                  );
                },
              ),
            ),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
              decoration: const BoxDecoration(
                color: Color(0xFFFFFFFF),
                border: Border(top: BorderSide(color: Color(0xFFE2E8F0))),
                borderRadius: BorderRadius.only(topLeft: Radius.circular(20), topRight: Radius.circular(20)),
              ),
              child: Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: _chatInputController,
                      style: const TextStyle(fontSize: 14, color: Color(0xFF0F172A)),
                      decoration: const InputDecoration(
                        hintText: "Напишите оператору...",
                        hintStyle: TextStyle(color: Colors.black45),
                        border: InputBorder.none,
                        contentPadding: EdgeInsets.symmetric(horizontal: 8),
                      ),
                      onSubmitted: (value) => _handleSendChatMessage(),
                    ),
                  ),
                  IconButton(
                    icon: const Icon(Icons.send, color: Color(0xFF0F172A)),
                    onPressed: _handleSendChatMessage,
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildBillRow(String label, String value, {bool isCost = false}) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: const TextStyle(fontSize: 13, color: Color(0xFF64748B))),
          Text(
            value,
            style: TextStyle(
              fontSize: isCost ? 15 : 13,
              fontWeight: FontWeight.bold,
              color: isCost ? Colors.black : const Color(0xFF0F172A),
            ),
          ),
        ],
      ),
    );
  }
}

// Custom Map Painter (Renders Tashkent grid layout in light mode)
class TashkentMapPainter extends CustomPainter {
  final List<MockCar> cars;
  final MockCar? selectedCar;

  TashkentMapPainter({required this.cars, this.selectedCar});

  @override
  void paint(Canvas canvas, Size size) {
    // 1. Draw Background grid
    final bgPaint = Paint()..color = const Color(0xFFF8FAFC);
    canvas.drawRect(Offset.zero & size, bgPaint);

    final roadPaint = Paint()
      ..color = const Color(0xFFE2E8F0)
      ..strokeWidth = 3
      ..style = PaintingStyle.stroke;

    final secondaryRoadPaint = Paint()
      ..color = const Color(0xFFF1F5F9)
      ..strokeWidth = 1.5
      ..style = PaintingStyle.stroke;

    // 2. Draw mock Tashkent Streets
    canvas.drawLine(Offset(0, size.height * 0.4), Offset(size.width, size.height * 0.45), roadPaint);
    canvas.drawLine(Offset(0, size.height * 0.7), Offset(size.width, size.height * 0.65), roadPaint);
    canvas.drawLine(Offset(size.width * 0.5, 0), Offset(size.width * 0.52, size.height), roadPaint);
    canvas.drawLine(Offset(size.width * 0.25, 0), Offset(size.width * 0.3, size.height), secondaryRoadPaint);
    canvas.drawLine(Offset(size.width * 0.75, 0), Offset(size.width * 0.7, size.height), secondaryRoadPaint);

    // 3. Draw Tashkent Park (subtle green area in the center)
    final parkPaint = Paint()
      ..color = const Color(0xFF0F172A).withOpacity(0.04)
      ..style = PaintingStyle.fill;
    canvas.drawCircle(Offset(size.width * 0.51, size.height * 0.42), 65, parkPaint);

    // 4. Draw car pins
    for (var car in cars) {
      final isSelected = selectedCar?.id == car.id;
      final px = car.x * size.width;
      final py = car.y * size.height;

      // Pulse effect for selected car
      if (isSelected) {
        final pulsePaint = Paint()
          ..color = const Color(0xFF0F172A).withOpacity(0.15)
          ..style = PaintingStyle.fill;
        canvas.drawCircle(Offset(px, py), 22, pulsePaint);
      }

      // Outer border circle
      final borderPaint = Paint()
        ..color = isSelected ? const Color(0xFF0F172A) : const Color(0xFFCBD5E1)
        ..style = PaintingStyle.fill;
      canvas.drawCircle(Offset(px, py), 9, borderPaint);

      // Inner color circle
      final innerPaint = Paint()
        ..color = isSelected ? Colors.white : const Color(0xFFFFFFFF)
        ..style = PaintingStyle.fill;
      canvas.drawCircle(Offset(px, py), 7, innerPaint);
    }
  }

  @override
  bool shouldRepaint(covariant TashkentMapPainter oldDelegate) {
    return oldDelegate.selectedCar != selectedCar || oldDelegate.cars != cars;
  }
}
