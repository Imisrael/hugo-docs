Table of Contents

5.1.12 Data Registration
========================

Overview
--------

This section describes the data registration for TimeSeries containers

  

Sample Data
-----------

Similar to collection sample, data to be registered is initially stored in a CSV file. Data must be registered in order to later read. The contents of the CSV file (Instrument_log.csv) is as follows:

*   Data held
*   Measuring instrument ID
*   Timestamp
*   Temperature
*   Live image file path

  
**List.1 Measurement Log Contents** (instrument_log.csv)

weather\_station\_1,2016/7/1 0: 00,50, liveimage1.jpg
weather\_station\_2,2016/7/1 0: 00,50,
weather\_station\_3,2016/7/1 0: 00,50, liveimage2.jpg
weather\_station\_4,2016/7/1 0: 00,50,
weather\_station\_5,2016/7/1 0: 00,50, liveimage1.jpg
(Snip)

Data Registration Process
-------------------------

The following snippet demonstrates data registration.

**List.2 Register TimeSeries Container** (TimeSeriesRegister.java)

// Read InstrumentLog data from csv
List<InstrumentLog> logList = logLogic.readCsv();
// Register TimeSeries Container
logLogic.registerTimeSeriesContainer(store, logList);

*   L.32: Process the CSV into a list of Instrument Logs.
*   L.34: Register the parsed data in GridDB.

  
**List.3 Read Measurement Log** (InstrumentLogLogic.java)

public List<InstrumentLog> readCsv()
    throws IOException, ParseException, SerialException, SQLException {
    // Read CSV file
    List<InstrumentLog> logList = new ArrayList<InstrumentLog>();
    SimpleDateFormat format = new SimpleDateFormat("yyyy/MM/dd HH: mm", Locale.US);
    String\[\] line = null;
    CSVReader reader = new CSVReader(new FileReader("data/instrument_log.csv"));

    try {
        while ((line = reader.readNext()) != null) {
            InstrumentLog log = new InstrumentLog();
            log.weatherStationId = line\[0\];
            log.timestamp = format.parse(line\[1\]);
            log.temperture = Float.valueOf(line\[2\]);
    
            // Write Blob data
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            String filePath = line\[3\];
            if ((filePath != null) && (!filePath.isEmpty())) {
                File imageFile = new File(filePath);
                if (imageFile.exists() && imageFile.isFile()) {
                    InputStream inputStream = null;
                    try {
                        inputStream = new BufferedInputStream(new FileInputStream(imageFile));
                        byte\[\] buff = new byte\[1024\];
                        while ((inputStream.read(buff)) != -1) {
                            outputStream.write(buff);
                        }
                    } finally {
                        if (inputStream != null) {
                            inputStream.close ();
                        }
                    }
                }
            }
            log.liveImage = new SerialBlob(outputStream.toByteArray());
    
            logList.add(log);
        }

    } finally {
        reader.close();
    }
    return logList;
}

### Read CSV

*   L.67: Loading a CSV file `instrument_log.csv` with the data of the measurement log.
*   L.70-74: read the contents of the CSV, it is set to an instance of `InstrumentLog`.
*   L.77-95: read the file of the CSV of the live image file path, is writing the data to the Blob data.

  
**List.4 TimeSeries Container Registration Process** (InstrumentLogLogic.java)

public void registerTimeSeriesContainer(GridStore store, List<InstrumentLog> logList)
        throws GSException {
    for (InstrumentLog log : logList) {
        // Retrieve TimeSeries Container
        TimeSeries<InstrumentLog> logTs =
                store.putTimeSeries(log.weatherStationId, InstrumentLog.class);

        // Disable Auto Commit
        logTs.setAutoCommit(false);

        // Specify Time
        logTs.put(log.timestamp, log);

        // Specify Current Time
        // Comment out because the result would change on every execution
        // ts.append(log);

        // Instrument log timestamp is every 6 hours.
        // When the interpolation of 3 hours prior time to the log,
        // the temperature of the intermediate is registered
        Date medianTime = TimestampUtils.add(log.timestamp, -3, TimeUnit.HOUR);
        // Creating a TimeSeries Container when interpolating the values of temperature
        InstrumentLog medianLog = logTs.interpolate(medianTime, "temperture");
        // If there is no log, a NULL is returned before the interpolated time
        if (medianLog != null) {
            logTs.put(medianTime, medianLog);
        }

        // Commit
        logTs.commit();
    }
}

To register the data to the time series container in one of the following ways.

### Specified time

*   L.128: `TimeSeries.put (Date, Class)` method uses the time specified as the key when the data is registered.

### Current time

*   L.132: `TimeSeries.append (Class)` method uses the current time as the key. However, it has been commented out so that execution result is always constant.

### Interpolated time

*   L.137: `TimestampUtils.add (Date, int, TimeUnit)` specifies a time 3 hours prior to the time of the time of measurement log.
*   L.139: `TimeSeries.interpolate (Date, String)` generates a linear interpolation of the value corresponding to the specified time. This means, for example, when the temperature is 70°F at 6 and 80°F at 12, the interpolated value would be 75°F if 9 was specified. To obtain a linear interpolation value must have adjacent keys or the same timestamp must have been previously registered.
*   L.142: `TimeSeries.put (Date, Class) and is registered with the data that is linear interpolation with` method.

  

The following topics are described in more detail in the [Collection Registration](5-1-8_collection-register.php) chapter:

*   Auto-commit
*   Commit
*   Roll Back

  

### Complete source code

Complete source code used in this sample can be downloaded from the following.

Download: [timeseries-register.zip](img/timeseries-register.zip)
