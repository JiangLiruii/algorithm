/**
 * 1 给定一个N* 2 的二维数组, [[a1,b1], [a2,b2], [a3,b3]], 规定:如果要把而原数组甲放到而原数组乙上
 * 甲中的 a 和 b 必须分别大于乙中的 a 和 b,
 * 如果在二维数组中随意选择二元组, 请问二元组最多可以网上摞几个?
 * 要求: 复杂度为 O(nlogn)
 */
function calc(arr) {
    var help_arr = [];
    var res_arr = [];
    var arr_sorted = arr.sort(function (e1, e2) {
        if (e1[0] < e2[0]) {
            return -1;
        }
        else if (e1[0] == e2[0]) {
            if (e1[1] == e2[1]) {
                return 0;
            }
            else if (e1[1] > e2[1]) {
                return -1;
            }
            else if (e1[1] < e2[1]) {
                return 1;
            }
        }
        else {
            return 1;
        }
    });
    arr_sorted.map(function (inner_arr) {
        if (!help_arr[inner_arr[0]]) {
            help_arr[inner_arr[0]] = inner_arr[1];
        }
    });
    help_arr.forEach(function (inner_arr) {
        if (inner_arr && inner_arr) {
            if (!res_arr[0]) {
                return res_arr[0] = inner_arr;
            }
            for (var index in res_arr) {
                if (res_arr[index] > inner_arr) {
                    res_arr[index] = inner_arr;
                }
                else if (res_arr[index] < inner_arr) {
                    res_arr[res_arr.length] = inner_arr;
                }
                return;
            }
        }
    });
    console.log(res_arr.length);
}
