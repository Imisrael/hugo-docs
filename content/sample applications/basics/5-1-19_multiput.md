Table of Contents

5.1.19 Multi-Put
================

Overview
--------

This section describes Multi-put, a method of registering batches of data at one time. It is described further in the [GridDB Technical Reference](https://www.toshiba.co.jp/cl/pro/bigdatapf/lineup/GridDB/doc/GridDB_TechnicalReference.html#sec-4.7.2).

Batch Processing
----------------

When data is sent or received in a one by one manner it is possible to reach the upper limit of network bandwidth and throughput will peak, the following GridDB API's offer a solution to this problem with methods to work with large sets of data in an efficient manner:

*   Multi-put
*   Multi-get
*   Multi-query

  

Create Row for registration
---------------------------

**List.1 Create Row of WeatherStation**(MultiPut.java)

private static Row createWeatherStationRow(GridStore store, String id, String name,
        double latitude, double longitude, boolean hasCamera) throws GSException {
    // Create WeatherStation Row
    ContainerInfo wsContainerInfo = store.getContainerInfo("weather_station");
    Row wsRow = store.createRow(wsContainerInfo);

    // Set by specifying the index of the order of definition of the WeatherStation class
    // ID
    wsRow.setString(0, id);
    // Name
    wsRow.setString(1, name);
    // Latitude
    wsRow.setDouble(2, latitude);
    // Longitude
    wsRow.setDouble(3, longitude);
    // hasCamera
    wsRow.setBool(4, hasCamera);

    return wsRow;
}

**List.2 Create Row of Intrument Log(MultiPut.java)**

private static Row createIntrumentLogRow(GridStore store, Date timestamp, String weatherStationId,
        float temperture, Blob liveImage)
        throws GSException, ParseException, SerialException, SQLException {
    // Create IntrumentLogRow Row
    ContainerInfo logContainerInfo = store.getContainerInfo("weather\_station\_99");
    Row logRow = store.createRow(logContainerInfo);

    // Set by specifying the index of the order of definition of the InstrumentLog class
    // Timestamp
    logRow.setTimestamp(0, timestamp);
    // ID of WeatherStation
    logRow.setString(1, weatherStationId);
    // Temperture
    logRow.setFloat(2, temperture);
    // Live Image data
    logRow.setBlob(3, liveImage);

    return logRow;
}

Multi-Put execution
-------------------

**List.3 Multi-Put execution**(MultiPut.java)

// Create Connection
store = gridLogic.createGridStore();

SimpleDateFormat format = new SimpleDateFormat("yyyy/MM/dd HH:mm", Locale.US);

// multiput Rows
Map<String, List<Row>> containerRowsMap = new HashMap<>();

// Create WeatherStation Row
Row wsRow =
        createWeatherStationRow(store, "99", "new WeaterStation", 45.26, 75.42, true);

// Add multiput value
List<Row> wsRowList = new ArrayList<>();
wsRowList.add(wsRow);
containerRowsMap.put("weather_station", wsRowList);

// Create InstrumentLog Container and Row
store.putTimeSeries("weather\_station\_99", InstrumentLog.class);

// Create WeatherStation Row
Row logRow = createIntrumentLogRow(store, format.parse("2016/07/03 12:00:00"),
        "weather\_station\_99", 40.5f,
        new SerialBlob(new byte\[\] {0x10, 0x11, 0x12, 0x13, 0x14, 0x15}));

// Add multiput value
List<Row> logRowList = new ArrayList<>();
logRowList.add(logRow);
containerRowsMap.put("weather\_station\_99", logRowList);

// Register by multiput
store.multiPut(containerRowsMap);

Result of Multi-Get execution
-----------------------------

**List.4 Obtain of Multi-Put results(WeatherStation)**(MultiPut.java)

System.out.println("#####  WeatherStation:");
System.out.println("ID\\tName\\t\\t\\tLongitude\\tLatitude\\tCamera");
// Get WeatherStation
Collection<String, WeatherStation> weatherStationCol =
        store.getCollection("weather_station", WeatherStation.class);
WeatherStation weatherStation = weatherStationCol.get(rowKey);

System.out.println(String.format("%-3s\\t%-20s\\t%-10s\\t%-10s\\t%-5s", weatherStation.id,
        weatherStation.name, weatherStation.latitude, weatherStation.longitude,
        weatherStation.hasCamera));

**List.5 Result of Multi-Get execution(WeatherStation)**

\#####  WeatherStation:
ID      Name                    Longitude       Latitude        Camera
99      new WeatherStation       45.26           75.42           true

**List.6 Obtain of Multi-Put results(InstrumentLog)**(MultiPut.java)

System.out.println("#####  InstrumentLog:");
System.out.println("Timestamp\\t\\t\\tWeatherStation ID\\tTemperture");
TimeSeries<InstrumentLog> logTs =
        store.getTimeSeries("weather\_station\_99", InstrumentLog.class);
InstrumentLog log = logTs.get(rowKey);
// Make a displayable byte string
String byteText = InstrumentLogLogic.makeByteString(log.liveImage);

System.out.println(String.format("%s\\t%-20s\\t%-10s\\t%s", log.timestamp,
        log.weatherStationId, log.temperture, byteText));

**List.7 Result of Multi-Get execution(InstrumentLog)**

\#####  InstrumentLog:
Timestamp                       WeatherStation ID       Temperature      Live Image
Sun Jul 03 12:00:00 EDT 2016    weather\_station\_99      40.5       

Source Code
-----------

Complete source code used in this sample can be downloaded from the following.

Download:[multi-put.zip](img/multi-put.zip)
