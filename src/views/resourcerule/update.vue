<template>

<div class="app-container">
  <el-form label-width="120px">
    <el-col :span="6">
      <el-form-item label="应用名称">
            <el-input placeholder="请输入内容"  v-model="appName" :disabled="true"></el-input>
      </el-form-item>
    </el-col>
    <el-col :span="6">
      <el-form-item label="灰度资源">
        <el-input placeholder="必须与应用内注解配置一致"  v-model="resourceName" :disabled="false"></el-input>
      </el-form-item>
    </el-col>
    <el-col :span="12">

    </el-col>

  <br><br><br><br><br>


  <el-row>
    <el-col :span="24">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>规则配置</span>
        </div>


        <el-col :span="24">
          <el-form-item label="全局灰度开关:">
            <el-switch
              v-model="fullswitch"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-text="开"
              inactive-text="关">
            </el-switch>
          </el-form-item>
        </el-col>


        <el-col :span="24">
          <el-form-item label="host规则:">



            <el-col :span="3" v-for="(item,i) in onlineHosts">
                <el-button @click="selecthost(item)" v-bind:type="item.type" class="component-sel">{{item.text}}</el-button>
            </el-col>
          </el-form-item>
        </el-col>




        <el-col :span="24">
          <el-form-item label="频率规则:">
            <el-col :span="24">
              <el-switch
                @change="changeFrequencyMode"
                v-model="frequenceRule.frequencyMode"
                active-color="#13ce66"
                inactive-color="#ff4949"
                active-text="窗口模式"
                inactive-text="递增模式"
                >
              </el-switch>
            </el-col>


            <el-col :span="8" style="margin-top:10px;">
              <el-input v-model="frequenceRule.initLimit" placeholder="初始允许的请求个数 X" style="width:60%"></el-input>
            </el-col>
            <el-col :span="8" style="margin-top:10px;">
              <el-input v-model="frequenceRule.timeWindowSec" placeholder="窗口期,单位为秒 Y" style="width:60%"></el-input>
            </el-col>
            <el-col :span="8" style="margin-top:10px;">
              <el-input v-model="frequenceRule.limitStep" placeholder="重置请求个数或递增步长 Z" style="width:60%"></el-input>
            </el-col>

            <el-col :span="24" style="margin-top:10px;" :hidden="frequencyMode">
              <i class="el-icon-warning"></i>
              <span style="margin-top: 10px;font-size: 12px;font-family: -webkit-body;background-color: rgb(255 254 222);">
                  递增模式：灰度资源初始允许X个，在Y窗口期时间之后，递增为该资源增加Z个请求的阈值，比如：初始化初始化5个请求，10分钟窗口期，20个递增，则会有 0-10分钟：5 | 10-20分钟：20 | 20-30分钟： 40 ，以此类推
              </span>

            </el-col>
            <el-col :span="24" style="margin-top:10px;" :hidden="!frequencyMode">
              <i class="el-icon-warning"></i>
              <span style="margin-top: 10px;font-size: 12px;font-family: -webkit-body;background-color: rgb(228 231 255);">
                窗口模式：灰度资源初始允许X个，在Y窗口期时间之后，重置该资源Z个请求的阈值，比如：初始化5个请求，10分钟窗口期，20个重置，则会有 0-10分钟：5 | 10-20分钟：20 | 后续全部为20个请求重置 <br>
              </span>

            </el-col>


          </el-form-item>
        </el-col>



        <el-col :span="24">
          <el-form-item label="参数规则:">
            <el-col :span="24">
              <el-input
                type="textarea"
                :rows="10"
                placeholder="请输入内容"
                v-model="resourceRules">
              </el-input>
            </el-col>
          </el-form-item>
        </el-col>
      </el-card>





    </el-col>
  </el-row>
    <br><br>
    <el-row>
      <el-col :span="24" align="center">
        <el-button type="primary" @click="submitstrategy">提交灰度策略</el-button>
      </el-col>
    </el-row>


</el-form>

</div>



</template>

<script>
  import axios from 'axios'
    export default {
      created() {
        this.$data.appName = this.$route.query.appName
        this.$data.resourceName = this.$route.query.resourceName

        //- 根据应用名称LOAD已经注册的host
        axios({
          method: 'get',
          url: 'http://localhost:8089/host/load?appName='+this.$data.appName
        }).then(response => {
            console.log(response.data)
            let hosts = response.data.body;

            for (var i in hosts) {
              this.$data.onlineHosts.push({
                  type : "info",
                  text : hosts[i],
                choose : false
              })
            }


            this.initPage()
        })
      },
      data() {
        return {
          fullswitch: false,  //- 全局开关
          frequencyMode : false,
          appName : "123",
          frequenceRule : {
            frequencyMode : true,
            initLimit : undefined,
            timeWindowSec : undefined,
            limitStep : undefined
          },
          resourceName : "",
          chooseApp : "",
          onlineHosts : [],
          resourceRules : '{\n' +
            '    "orderMain": [\n' +
            '        {\n' +
            '            "fieldName": "orgCode",\n' +
            '            "matchStrategy": 2,\n' +
            '            "parameterAnnotaionName": "orderMain",\n' +
            '            "value": "1105368"\n' +
            '        },\n' +
            '        {\n' +
            '            "fieldName": "stationId",\n' +
            '            "matchStrategy": 3,\n' +
            '            "parameterAnnotaionName": "orderMain",\n' +
            '            "value": 124\n' +
            '        },\n' +
            '        {\n' +
            '            "fieldName": "orderId",\n' +
            '            "matchStrategy": 4,\n' +
            '            "parameterAnnotaionName": "orderMain",\n' +
            '            "value": 122\n' +
            '        }\n' +
            '    ]\n' +
            '}',
          resources : [],
          options: [{
            value: '1',
            label: '大于'
          }, {
            value: '2',
            label: '小于'
          }, {
            value: '3',
            label: '等于'
          }, {
            value: '4',
            label: '包含'
          }],
          chooseStrage : ""
        }
      },
      methods:{
        initPage(){
          //- LOAD资源配置，渲染页面
          axios({
            url: 'http://localhost:8089/resource/view',
            method: 'post',
            headers: {'content-type': 'application/json'},
            data : {
              appName : this.$data.appName,
              resourceName : this.$data.resourceName
            }
          }).then(response => {
            let res = JSON.parse(response.data.body);
            this.$data.fullswitch = res.switchRule.openOrNot


            let allHosts = this.$data.onlineHosts;
            if (undefined != res.hostRule){
              let choosehosts = res.hostRule.ips.split(",");

              for (let k in allHosts){
                for (let j in choosehosts){
                  if (allHosts[k].text == choosehosts[j]){
                    allHosts[k].choose = true
                    allHosts[k].type = 'success'
                  }
                }
              }
            }

            let frequencyRule = res.frequencyRule;
            if (undefined != res.frequencyRule){
              this.$data.frequenceRule = res.frequencyRule
            }


            if (undefined != res.matchRule){
              this.$data.resourceRules = JSON.stringify(res.matchRule.mapConditions,null,2)
            }
          })
        },
        //- 选择主机方法
        selecthost(item){
          if (item.choose){
            item.choose = false;
            item.type = "info"
          } else{
            item.choose = true;
            item.type = "success"
          }
        },
        changeFrequencyMode(){

        },submitstrategy(){
          //- 主机规则
          let ips = '';
          for (let i in this.$data.onlineHosts){
              if (this.$data.onlineHosts[i].choose){
                ips += this.$data.onlineHosts[i].text+","
              }
          }


          //- 方法规则
          let rules = {}
          rules.switchRule = {openOrNot : this.$data.fullswitch}
          rules.hostRule = {ips : ips};
          rules.matchRule = {
            mapConditions : JSON.parse(this.$data.resourceRules)
          };

          let frequenceRule = this.$data.frequenceRule;
          if (frequenceRule.limitStep != undefined || frequenceRule.initLimit != undefined || frequenceRule.limitStep != undefined) {
            rules.frequencyRule = this.$data.frequenceRule;
          }


          //- 提交规则
          axios({
            method: 'post',
            headers: {'content-type': 'application/json'},
            url: 'http://localhost:8089/resource/update',
            data : {
              appName : this.$data.appName,
              resourceName : this.$data.resourceName,
              rules : JSON.stringify(rules)
            },
          }).then(response => {
              if (response.data.code == 200){
                this.$alert('更新规则成功', '资源规则维护', {
                    confirmButtonText: '确定'
                });
              }else{
                this.$alert(response.data.msg, '资源规则维护', {
                    confirmButtonText: '确定'
                });
              }
          })
        }
      }



    }
</script>

<style scoped>

</style>
