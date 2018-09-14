+++
title = "Installation"
weight = 2
+++


The following instructions are for the Standard Edition of GridDB. Instructions for the Community Edition can be found [below](#text-2)

### Setup

This chapter explains the installation of a node onto a single machine. See the chapter on operations for the cluster configuration.

```
// The lsb_release command prints certain LSB (Linux Standard Base) and Distribution information.
$ lsb_release -id
Distributor ID: CentOS
Description: CentOS release 6.3 (Final)
```

*   **Installing a Node**  
    
    The following 3 RPM packages are needed when installing a GridDB node. Place these packages anywhere in the machine.
    
    TODO: Table
      
    Package name
    
    File name
    
    Description
    
    griddb-server
    
    griddb-server-X.X.X-linux.x86_64.rpm
    
    The start and other commands for the GridDB node module and server are included.
    
    griddb-client
    
    griddb-client-X.X.X-linux.x86_64.rpm
    
    One set of operating commands except start node is included.
    
    griddb-docs
    
    griddb-docs-X.X.X-linux.x86_64.rpm
    
    GridDB manual and program samples are included.
    
\*X.X.X is the GridDB version

Install using the rpm command as a root user.


```
$ su
\# rpm -Uvh griddb-server-X.X.X-linux.x86_64.rpm
Under preparation...           ########################################### \[100%\]
User gsadm and group gridstore have been registered.
GridStore uses new user and group.
   1:griddb-server                 ########################################### \[100%\]
\# rpm -Uvh griddb-client-X.X.X-linux.x86_64.rpm
Under preparation...           ########################################### \[100%\]
User and group has already been registered correctly.
GridStore uses existing user and group.
   1:griddb-client                  ########################################### \[100%\]
\# rpm -Uvh griddb-docs-X.X.X-linux.x86_64.rpm
Under preparation...           ########################################### \[100%\]
   1:griddb-docs                   ########################################### \[100%\]
```

When you install the package, the following group and user are created in the OS. This OS user is set as the operator of GridDB.

  
TODO: Table    
Group

User

Home directory

gridstore

gsadm

/var/lib/gridstore

The following environment variables are defined in this gsadm user.

  
TODO: Table
Environment variables

Value

Meaning

GS\_HOME

/var/lib/gridstore

gsadm/GridDB home directory

GS\_LOG

/var/lib/gridstore/log

Event log file output directory

**\[Points to note\]**

*   These environment variables are used in the operating commands described later.
*   The password of the gsadm user has not been set. With the root user privilege, please set the password appropriately.
    *   Some of the functions of the operation tools may be necessary.

In addition, when the GridDB node module is installed, services that are executed automatically upon startup of the OS will be registered.

  
TODO: Table
Service Name

Run Level

gridstore

3, 4, 5

The service registration data can be checked with the following command.

\# /sbin/chkconfig --list | grep gridstore
gridstore 0:off 1:off 2:off 3:on 4:on 5:on 6:off

The GridDB node will be started automatically by this service during OS startup.

**\[Points to note\]**

*   Services will not start automatically immediately after installation.

To Stop auto startup of a service, use the command below.

\# /sbin/chkconfig gridstore off

See the chapter on services in 'GridDB Operational Management Guide' (GridDB_OperationGuide.html) for details of the services.

**Post-Installation Checks**  

Check the directory configuration of the installed GridDB node.

First, check that the GridDB home directory, and related directory and files have been created.

### GridDB home directory

```
/var/lib/gridstore/                      # GridDB home directory
                   admin/                # integrated operational management GUI home directory
                   backup/               # backup directory
                   conf/                 # definition file directory
                        gs_cluster.json  # cluster definition file
                        gs_node.json     # node definition file
                        password         # user definition file
                   data/                 # database file directory
                   log/                  # log directory
```

Confirm the following command.

```
$ ls /var/lib/gridstore/
admin backup conf data log
```

Next, check that the installation directory has been created.

### Installation directory

```
/usr/gridstore-X.X.X/              # installation directory
                     Fixlist.pdf   # revision record
                     Readme.txt    # release instructions
                     bin/          # operation command, module directory
                     conf/         # definition file sample directory
                     docs/         # document directory
                     etc/
                     lib/          # library directory
                     license/      # license directory
                     prop/         # configuration file directory
                     web/          # integrated operational management GUI file directory
```
 
Confirm with the following command.

```
$ ls /usr/gridstore-X.X.X/
Fixlist.pdf Readme.txt bin conf etc lib license prop web
```

All documents have been compressed into a single ZIP file. Decompress and refer to the documents where appropriate as shown below.

```
$ cd /usr/gridstore-X.X.X/docs
$ unzip griddb-documents-X.X.X.zip
```

In addition, the following symbolic links are created as shown below in a few directories under the installation directory for greater convenience.

```
$ ls /usr/gridstore/
conf lib prop web
```

Lastly, confirm the version of the server module installed with the following command.

```
$ gsserver --version
GridDB version X.X.X build XXXXX
```

**\[Points to note\]**

The following files are created when GridDB is operated according to the following procedure.

\[Database file\]

```
/var/lib/gridstore/                     # GridDB home directory
                   data/                # database file directory
                        gs\_log\_n_m.log  # log file to record the transaction logs (n, m are numbers)
                        gs\_cp\_n_p.dat   # checkpoint file to record data regularly (n, p are numbers)
```

\[Log file\]

```
/var/lib/gridstore/                            # GridDB home directory
                   log/                        # log directory
                       gridstore-%Y%m%d-n.log  # event log file
                       gs_XXXX.log             # operation tool log file
```

The directory where these files are created can be changed by the parameter settings in the node definition file.

\*gs\_XXXX is an operation tool name. (Example: gs\_startnode.log)

Setting Up an Administrator User  

Administrator privilege is used for authentication related matter within the nodes and clusters. Creation date of administrator user is saved in the user definition file. The default file is as shown below.

```
   /var/lib/gridstore/conf/password
```

The default user below exists immediately after installation.

  
TODO: Table
User

Password

Example of proper use

admin

admin

For authentication of operation administrator user, operation commands

system

manager

For authentication of application user, client execution

Administrator user information including the above-mentioned default users can be changed using the user administration command in the operating commands.

  
TODO: Table
Command

Function

gs\_adduser

Add an administrator user

gs\_deluser

Delete an administrator user

gs\_passwd

Change the password of administrator user

Change the password as shown below when using a default user. The password is encrypted during registration.

```
$ gs_passwd admin
Password: (enter password)
Retype password: (re-enter password)
```

**\[Points to note\]**

*   A GridDB administrator user is different from the OS user gsadm created during installation.
*   A change in the administrator user information using a user administration command becomes valid when a node is restarted.
*   In order to use it for authentication purposes in the client, the same user data needs to be registered in all the nodes. Copy the user definition file and make sure the same user data can be referred to in all the nodes.
*   Execute the operating command as a gsadm user.

**\[Memo\]**

*   See “GridDB Operational Management Guide” ([GridDB\_OperationGuide.html](https://griddb.net/en/docs/manuals/v3.1/GridDB_OperationGuide.html)) for details of the user management commands.

Installation (Community Editon) on a Singular Node
--------------------------------------------------

This section will layout the steps to installing GridDB. These instructions have been confirmed to work on **CentOS version 6.7.** First, download the GridDB RPM: [here](https://github.com/griddb/griddb_nosql/releases). Switch to the root user and install the RPM by using the “rpm” command:

```
$ su
\# rpm -ivh griddb\_nosql-X.X.X-linux.x86\_64.rpm
Preparing...                ########################################### \[100%\]

Information:
  User gsadm and group gridstore have been registered.
  GridDB uses new user and group.

   1:griddb_nosql           ########################################### \[100%\]
```	

### Confirmation After Installation

After installing GridDB's node module, the user “gsadm” and the group “gridstore” are created. Use the user and group for running a node module and operational commands. And please note that a password for the new user gsadm is not automatically set upon creation, so please take the time to set one. If installation completed normally, the following directories and files are created as well as necessary modules and commands.

```
/var/lib/gridstore/        # GridDB home directory
     backup/               # Backup directory(unused)
     conf/                 # Directory storing definition files
         gs_cluster.json   # Cluster definition file
         gs_node.json      # Node definition file
         password          # User definition file
     data/                 # Directory storing database files
     log/                  # Directory storing event log files
```

We should also confirm that the following files and directories exist:

```
$ ls /var/lib/gridstore/*
/var/lib/gridstore/backup:

/var/lib/gridstore/conf:
gs\_cluster.json  gs\_node.json  password

/var/lib/gridstore/data:

/var/lib/gridstore/log:
```

Confirm the directory structure of the installed GridDB client libraries. If installation completed normally, the following files are created.

```
$ ls -l /usr/share/java/\*gridstore\*
lrwxrwxrwx 1 gsadm gridstore 46 Apr 11 20:43 /usr/share/java/gridstore-conf.jar -> /usr/griddb-X.X.X/bin/gridstore-conf-X.X.X.jar
lrwxrwxrwx 1 gsadm gridstore 41 Apr 11 20:43 /usr/share/java/gridstore.jar -> /usr/griddb-X.X.X/bin/gridstore-X.X.X.jar
```

If you start a GridDB node and then access and run the node from a client, the following files are created in the directories to store database files and event log files.

```
/var/lib/gridstore/        # GridDB home directory
     data/                 # Directory storing database files
         gs\_log\_n_m.log    # File recording transaction logs (n, m: positive number)
         gs\_cp\_n_p.dat     # Checkpoint file recording data regularly (n, p: positive number)
```

The event log file will be in the following location

```
/var/lib/gridstore/              # GridDB home directory
     log/                        # Directory storing event logs
         gridstore-%Y%m%d-n.log  # Event log file
```

### Setting up an Administrator User

After all of this, you must create an administrator user to use GridDB. The administrator user information is stored in the User Definition file. The default file is as shown here: $GS\_HOME/conf/password.

After installation a default user called “admin” will be created. The operating commands used to change the default users’ information are shown below.

  
TODO: Table

Command

Function

gs\_adduser

Add an administrator user

gs\_deluser

Delete an administrator user

gs\_passwd

Change the password of an administrator user

It is recommended that you add a password to the user “admin” as one is not set upon creation.

```
$ gs_passwd admin
Password:（Input password）
Retype password:（Input password again）
```
If you’d like to add another user beyond the default “admin” user, it must start with “gs#”

```
$ gs_adduser gs#newuser
Password:（Input password）
Retype password:（Input password again）
```
Once the changes you wanted to make are done, you will need to restart the node for the changes to have effect.
