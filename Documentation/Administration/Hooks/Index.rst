.. ==================================================
.. FOR YOUR INFORMATION
.. --------------------------------------------------
.. -*- coding: utf-8 -*- with BOM.

.. include:: ../../Includes.txt


.. _adminstration:

Hooks
===============

The "gpsnose" extension provides one Hook.

**Tokens scanned**

::

$GLOBALS['TYPO3_CONF_VARS']['SC_OPTIONS']['gpsnose']['tokensScanned'][] = 'myext_cacheProc->proc';



    This Hook will be called everytime new MshupTokenScans where stored to the database

    You get a list of the added tokens in the $params['addedTokens']


Target group: **Administrators**

