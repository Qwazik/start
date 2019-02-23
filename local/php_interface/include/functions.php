<?php

function test($var){
	echo '<pre class="dump">';
	var_dump($var);
	echo '</pre>';
}
$GLOBALS['default_img'] = CFile::GetByID(137)->arResult[0];

function getElements($filter, $select = [], $col=99999, $order = ["SORT"=>"ASC"]){
	$result = [];
	$cnt = 0;
	if(CModule::IncludeModule('iblock')){
		$res = CIBlockElement::GetList(
			$order,
			$filter,
			false,
			false,
			$select
		);
		while ($ar_res = $res->Fetch()){
			if($cnt===$col) break;
			array_push($result, $ar_res);
			$cnt++;
		}
	}
	return $result;
}

function proportionalResize($picture, $max_width, $max_height){
	$propotionals = $max_height / $max_width;
	$need_width = intval((intval($picture['WIDTH']) > $max_width)?$max_width:$picture['WIDTH']);
	$need_height = $need_width * $propotionals;
	return CFile::ResizeImageGet($picture,['width'=>$need_width,'height'=>$need_height], BX_RESIZE_IMAGE_EXACT);
}

function clearTel($phone){
	return '+7'.preg_replace('/^8|\(|\)| /', '', $phone);
}