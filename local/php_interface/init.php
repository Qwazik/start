<?php

CModule::AddAutoloadClasses(
	'', // не указываем имя модуля
	array(
		// ключ - имя класса, значение - путь относительно корня сайта к файлу с классом
		'Data' => "/local/php_interface/include/classes/Data.php",
	)
);


if (isset($_GET['noinit']) && !empty($_GET['noinit']))
{
	$strNoInit = strval($_GET['noinit']);
	if ($strNoInit == 'N')
	{
		if (isset($_SESSION['NO_INIT']))
			unset($_SESSION['NO_INIT']);
	}
	elseif ($strNoInit == 'Y')
	{
		$_SESSION['NO_INIT'] = 'Y';
	}
}

if (!(isset($_SESSION['NO_INIT']) && $_SESSION['NO_INIT'] == 'Y'))
{
	if (file_exists($_SERVER["DOCUMENT_ROOT"]."/local/php_interface/include/functions.php"))
		require_once($_SERVER["DOCUMENT_ROOT"]."/local/php_interface/include/functions.php");
}
