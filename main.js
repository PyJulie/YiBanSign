    $('#btnNew').click(function () {
        var geox = parseFloat($.getUrlParam("GeoX")), geoy = parseFloat($.getUrlParam("GeoY"));
        var fSign = function (point) {
            var xq = GlbVar.zone || {};
            xq.GeoCenterLng = xq.GeoCenterLng || 108.863027;
            xq.GeoCenterLat = xq.GeoCenterLat || 34.234227;
            xq.GeoRadius = GlbVar.zone.GeoRadius || 500;
            xqpos = new BMap.Point(xq.GeoCenterLng, xq.GeoCenterLat);
            var dis = map.getDistance(xqpos, point);
            if (dis <= xq.GeoRadius) {
                var dt = new Date(GlbVar.StartTime);
                var startTime = isNaN(dt) ? '' : '' + dt.getFullYear() + '/' + (dt.getMonth() + 1) + '/' + dt.getDate() + ' ' + dt.getHours() + ':' + dt.getMinutes();
                dt = new Date(GlbVar.EndTime);
                var endTime = isNaN(dt) ? '' : '' + dt.getFullYear() + '/' + (dt.getMonth() + 1) + '/' + dt.getDate() + ' ' + dt.getHours() + ':' + dt.getMinutes();
                var obj = {
                    ZoneLng: GlbVar.zone.GeoCenterLng,
                    ZoneLat: GlbVar.zone.GeoCenterLat,
                    ZoneRadius: GlbVar.zone.GeoRadius,
                    StartTime: startTime,
                    EndTime: endTime,
                    UserLng: point.lng,
                    UserLat: point.lat,
                    StudentId: GlbVar.StudentId,
                    PlanId: GlbVar.PlanId,
                    SchoolCode: GlbVar.SchoolCode
                };
                //JSON.stringify(obj)
                $.post('signing.ashx', obj,
                    function (ret) {
                        if (ret.Success) {
                            GlbVar.PlanStatus = parseInt(ret.PlanStatus);
                            GlbVar.StudentStatus = parseInt(ret.StudentStatus);
                            GlbVar.Msg = ret.Msg || '';
                            //GlbVar.SignId = ret.SignId || '';
                            setSignFlag(GlbVar.PlanId, ret.SignId || '');
                            studentQdState();
                            $('#btnNew').remove();
                        } else {
                            $('#btnNew').button('reset');
                            $('#xxqdzt').empty().append('<span class="bs-callout-Success">签到失败！' + (ret.Msg || '') + '</span>');
                        }
                    }, 'json');
            } else {
                $('#btnNew').button('reset');
                alert("您当前不在校区范围内，不能签到！\r\n如果怀疑地图定位精度，请检查GPS是否启用。");
            }
        };
