.. ==================================================
.. FOR YOUR INFORMATION
.. --------------------------------------------------
.. -*- coding: utf-8 -*- with BOM.

.. include:: ../../Includes.txt


.. _configuration-extensionconfiguration:

Extension configuration
-----------------------


Go to the extension manager and open the configuration of the Extension Builder. Here several settings are configurable:

====================  ==========  ==================================================================  =============
Property:             Data type:  Description:                                                        Default:
====================  ==========  ==================================================================  =============
cacheType             string      Defines the used cache, if you have installed memcached, you have   typo3
                                  to define the server host/ip and the used port, if you use "none"
                                  there will be no cache used (not recommended)
--------------------  ----------  ------------------------------------------------------------------  -------------
memcachedServerHost   string      If cacheType is set to "memcached" insert here the host/ip of the   127.0.0.1
                                  Memcached-Server
--------------------  ----------  ------------------------------------------------------------------  -------------
memcachedServerPort   int         If cacheType is set to "memcached" insert here the port of the      11211
                                  Memcached-Server
--------------------  ----------  ------------------------------------------------------------------  -------------
cookieCryptPass       string      If set, the cookie of GpsNose will be crypted with this pass        
--------------------  ----------  ------------------------------------------------------------------  -------------
debugLog              boolean     If set, all req/res to the API will be logged                       FALSE
--------------------  ----------  ------------------------------------------------------------------  -------------
backendLockedUser     string      If set, the backendmodule will only be accessible to a specific     
                                  GpsNose-User
====================  ==========  ==================================================================  =============

