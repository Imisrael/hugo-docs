Table of Contents

5.1.6 Schema definition
=======================

Overview
--------

This chapter describes the schema definition and data types.

  

Schema definition
-----------------

Data of the measuring instruments and instrument log that will be handled in this sample application are defined in the container as follows.

**Table.1 Container Information**

  

Data

Container type

Quantity

Container name

Row key

Measuring instrument

Collection

1

weather_station

Instrument ID

Instrument log

TimeSeries Container

1 per instrument

weather\_station\_  
(Example:weather\_station\_1)

Logging date and time

One collection will be created with rows corresponding to different measuring instruments..  
One TimeSeries container will be created as the instrument log for each measuring instrument.  
The instrument ID to will be included in the instrument log's container name.

There are two ways to use Container in your programs.  
One is to pre-define the class statically which represents a row of the container.  
The other is to create a Container dynamically without preparing the pre-defined class.  
Here we describe only the static method, so please refer to [Meta-information](5-1-22_metainfo.php) for more details about dynamic method.

**List.1 Measuring instrument class**(WeatherStation.java)

package sample.row;

import com.toshiba.mwcloud.gs.RowKey;

/\*\*
 \* Class that represents the definition of the schema.
 */
public class WeatherStation {
    /\*\*
     \* ID of WeatherStation
     */
    @RowKey
    public String id;

    /\*\*
     \* Name of WeatherStation
     */
    public String name;

    /\*\*
     \* Installation Latitude
     */
    public double latitude;

    /\*\*
     \* Installation Longitude
     */
    public double longitude;

    /\*\*
     \* Camera exists or not
     */
    public boolean hasCamera;
}

*   L.12: The `@RowKey` annotates the field to be used as a row key.

  

**List.2 Instrument log class**(InstrumentLog.java)

package sample.row;

import java.sql.Blob;
import java.util.Date;

import com.toshiba.mwcloud.gs.RowKey;

/\*\*
 \* Class that represents the definition of the Row of Instrument log.
 */
public class InstrumentLog {
    /\*\*
     \* Timestamp of log
     */
    @RowKey
    public Date timestamp;

    /\*\*
     \* ID of Weather Station
     */
    public String weatherStationId;

    /\*\*
     \* Temperature of the measurement result
     */
    public float temperture;

    /\*\*
     \* Image data obtained by photographing the sky
     */
    public Blob liveImage;
}

*   L.15: The `@RowKey` annotates the field to be used as a row key.

  

Column Data Types
-----------------

The following types of data can be used in a GridDB column.

**Table.2 Available column type**

  

Column Type

Type in Program

Description

BOOL

boolean or Boolean

TRUE or FALSE.

STRING

String

Zero or more Unicode characters excluding the NULL character (U+0000).

BYTE

Byte or byte

Integer value in the following range.(-27 to 27-1)

SHORT

Short or short

Integer value in the following range.(-215 to 215-1)

INTEGER

Integer or int

Integer value in the following range.(-231 to 231-1)

LONG

Long or long

Integer value in the following range.(-263 to 263-1)

FLOAT

Float or float

Single-precision floating point number.

DOUBLE

Double or double

Double-precision floating point number.

TIMESTAMP

java.util.Date

Combination of a date and time consisting of year, month, day, hour, minute and second.

BLOB

java.sql.Blob

Binary data.

All types except `BLOB` can be stored as an array.

  

* * *

This chapter demonstrated how to define a schema and use it in your GridDB applications.  
Please refer to the [GridDB Programming Tutorial](https://www.griddb.net/en/docs/GridDB_ProgrammingTutorial.html) for more details on schema definitions.

### Complete source code

The complete source code used in this sample can be downloaded from the following:

Download: [container-schema.zip](img/container-schema.zip)
