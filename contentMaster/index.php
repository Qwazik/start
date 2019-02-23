<?
use Bitrix\Main\IO\Directory;
require($_SERVER["DOCUMENT_ROOT"] . "/bitrix/header.php");
if(!$USER->IsAdmin()) {
	header('Location: /404.php');
	die();
}
$APPLICATION->SetTitle("Новый раздел");
CModule::IncludeModule('iblock');
?>
	<script data-skip-moving="true" src="https://cdn.jsdelivr.net/npm/vue@2.5.17/dist/vue.js"></script>

	<style>
		.fill-item{
			margin: 50px 10px;
			display: flex;
		}
	</style>

	<?
		if(count($_POST['elements']) > 0){
			$ib_id = $_POST['iblock'];
			test($_FILES);
			$one_image = $_FILES['one_image_file'];
			if(!empty($one_image)) $one_image_picture = CFile::MakeFileArray(CFile::SaveFile($_FILES['one_image_file'], 'tmp_iblock'));
			test($one_image_picture);
			foreach ($_POST['elements'] as $key => $element) {
				if(empty($one_image)){
					$preview_picture = CFile::MakeFileArray(CFile::SaveFile($_FILES['preview_picture-'.$key], 'tmp_iblock'));
					$detail_picture = CFile::MakeFileArray(CFile::SaveFile($_FILES['detail_picture-'.$key], 'tmp_iblock'));
				}

				$el = new CIBlockElement;
				if(empty($element['name'])) continue;


				$arLoadProductArray = Array(
					"DATE_ACTIVE_FROM" => date($DB->DateFormatToPHP(FORMAT_DATETIME)),
					"CODE" => CUtil::translit($element['name'], "ru"),
					"MODIFIED_BY"    => $USER->GetID(), // элемент изменен текущим пользователем
					"IBLOCK_SECTION_ID" => false,          // элемент лежит в корне раздела
					"IBLOCK_ID"      => $ib_id,
					"NAME"           => $element['name'],
					"ACTIVE"         => "Y",            // активен
					"PREVIEW_TEXT"   => $element['preview_text'],
					"DETAIL_TEXT"    => $element['detail_text'],
					"DETAIL_PICTURE" => ($one_image_picture)?$one_image_picture:$detail_picture,
					"PREVIEW_PICTURE" => ($one_image_picture)?$one_image_picture:$preview_picture
				);


				if($PRODUCT_ID = $el->Add($arLoadProductArray))
					echo "New ID: ".$PRODUCT_ID;
				else
					echo "Error: ".$el->LAST_ERROR;
				}
				Directory::deleteDirectory($_SERVER['DOCUMENT_ROOT'].'/upload/tmp_iblock/');
			}

	?>


	<div id="app">
	<form action="<?=basename(__FILE__);?>" class="fill-form" method="post" enctype="multipart/form-data">
		<div class="fill-settings">
			<label class="input-row">
				<span class="input-name">Колличество: </span>
				<input type="number" max="20" v-model="elements">
			</label>

			<label class="input-row">
				<span class="input-name">Инфоблок: </span>
				<select name="iblock">
					<?
					// выберем все активные информационные блоки для текущего сайта типа catalog
					// у которых символьный код не my_products, со счетчиком активных элементов.
					$res = CIBlock::GetList(
						Array(),
						Array(
							'SITE_ID'=>SITE_ID,
							'ACTIVE'=>'Y',
							"CNT_ACTIVE"=>"Y"
						), true
					);
					while($ar_res = $res->Fetch())
					{
						echo $ar_res['NAME'].': '.$ar_res['ELEMENT_CNT'];
						?>
						<option value="<?=$ar_res['ID'];?>"><?='['.$ar_res['ID'].']'.$ar_res['NAME'];?></option>
						<?
					}
					?>
				</select>

				<span class="d-flex">
					<span>Одна картинка на все</span>
					<input type="checkbox" name="one_image" v-model="oneImage">
					<input type="file" name="one_image_file" v-if="oneImage">
				</span>
			</label>
		</div>
		<div class="fill-list">
		<div class="fill-form__item">
			<fill-item v-bind:id="id" v-bind:key="id" v-for="id in ids"></fill-item>
		</div>
		</div>
		<div class="fill-footer">
			<button type="submit">Отправить</button>
		</div>
	</form>

	</div>

	<script type="text/x-template" id="fillItem">
		<div class="fill-item">
			<p>{{id}}</p>
			<div>
			<input type="text" :name="name+'[name]'" placeholder="Название">

				<div class="d-flex">
					<span>Изображение анонса</span>
					<input type="file" :name="'preview_picture-'+id" placeholder="Изображение">
				</div>

				<div class="d-flex">
					<span>Детальное изображение</span>
					<input type="file" :name="'detail_picture-'+id" placeholder="Изображение" onchange="console.log(this.value)">
				</div>
			</div>
			<textarea :name="name+'[preview_text]'">Текст превью</textarea>
			<textarea :name="name+'[detail_text]'">Детальный текст</textarea>
		</div>
	</script>

	<script>
		Vue.component('fill-item', {
			template: '#fillItem',
			props: ['id'],
			computed: {
			    name: function(){return 'elements[' + this.id + ']';},
			}
		});

		var vm = new Vue({
			el: '#app',
			data: {
			    elements: 1,
				oneImage: false
			},
			computed: {
			    ids: function(){
			        var ids = [];
				    if(this.elements > 20) return 3;
			        for(var i = 0; i<this.elements; i++){
			            ids.push(i);
					}
					return ids;
			    }
			}
		});
	</script>



<? require($_SERVER["DOCUMENT_ROOT"] . "/bitrix/footer.php"); ?>