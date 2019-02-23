<?require($_SERVER["DOCUMENT_ROOT"]."/bitrix/modules/main/include/prolog_before.php");?>
<?php

$app = \Bitrix\Main\Application::getInstance();
$context = $app->getContext();
$request = $context->getRequest();
$server = $context->getServer();


$arMsgData = array();
$arResult = array(
    'hasError' => true,
    'msg' => "Ошибка отправки сообщения",
);
// проверим, что пришел POST
if (!$request->isPost()) {
	echo json_encode($arResult, JSON_UNESCAPED_UNICODE);
	die();
}
// подключим модуль инфоблоков
if (!CModule::IncludeModule('iblock')) {
	echo json_encode($arResult, JSON_UNESCAPED_UNICODE);
	die();
}
$arMsgData = array();
foreach ($request->getPostList() as $key => $param){
    if($key === 'form_event') {
	    $form_event = strtoupper($param);
	    continue;
    }
    $key  = strtoupper($key);
    $arMsgData[$key] = htmlspecialcharsEx($param);
}
switch ($form_event){
	case 'PRODUCT': $iblockId = 18;break;
	case 'QUEST': $iblockId = 17;break;
	case 'FEEDBACK': $iblockId = 16;break;
}
// проверим наличие данных

$el = new CIBlockElement();
$arLoadProductArray = array(
    "IBLOCK_SECTION_ID" => false, // элемент лежит в корне раздела
    "IBLOCK_ID" => $iblockId,
    "PROPERTY_VALUES" => $arMsgData,
    "NAME" => $arMsgData['FORM_SUBJECT'],
    "ACTIVE" => "Y", // активен
);

// создаем элемент
if ($ITEM_ID = $el->Add($arLoadProductArray)) {
    $arResult = array(
        'hasError' => false,
        'msg' => "Заявка отправлена! Спасибо за обращение!",
    );

    echo json_encode(array_merge($arResult, ['productArray'=>$arLoadProductArray]), JSON_UNESCAPED_UNICODE);

	// шлем почту
	if(isset($form_event)){
		CEvent::SendImmediate($form_event, "s1", $arMsgData);
	}else{
		$arResult['msg'] = 'Не задано почтовое событие в параметрах формы';
		echo json_encode(array_merge($arResult, ['productArray'=>$arLoadProductArray]), JSON_UNESCAPED_UNICODE);
	};

} else {
    $arResult['msg'] = $el->LAST_ERROR;
		echo json_encode(array_merge($arResult, ['productArray'=>$arLoadProductArray]), JSON_UNESCAPED_UNICODE);
	die();
}
?>
