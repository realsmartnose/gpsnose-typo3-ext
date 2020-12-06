.. ==================================================
.. FOR YOUR INFORMATION
.. --------------------------------------------------
.. -*- coding: utf-8 -*- with BOM.

.. include:: ../Includes.txt

.. _configuration:

Configuration
=============

It is very important to include the static templat "GpsNose (gpsnose)" in your template

If you use another variable for your page in your template (eg. seite), make sure that you use this ts too:

.. code-block:: ts

  seite {
    headerData {
      10100 < lib.gpsnose_validate
    }
    10100 = USER_INT
    10100 {
      userFunc = SmartNoses\Gpsnose\UserFuncs\GnLogin->login
      output = location.href = location.origin;
      output.stdWrap.wrap = <script>|</script>
    }
  }


Learn how to configure the plugin in the next three pages.

.. toctree::
    :maxdepth: 2
    :titlesonly:

    ExtensionConfiguration/Index
    Constants/Index
    Setup/Index
