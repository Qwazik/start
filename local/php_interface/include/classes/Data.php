<?
	class Data{
		public static $container = [];
		public static function set($key,$value){
			self::$container[$key]=$value;
		}
		public static function get($key){
			return self::$container[$key];
		}
		public static function dump(){
			test(self::$container);
		}
	}
?>