git push
# scp -i ~/study/docs/vpp.pem -r dist ubuntu@13.55.73.184:~/vpp
# scp -r dist root@47.101.150.158:/srv/www/shop_helper
# scp -i ~/study/docs/vpp.pem -r dist/* ubuntu@ec2-54-252-181-232.ap-southeast-2.compute.amazonaws.com:~/vpp
yarn build

# scp -r dist lcvpc:/srv/www/vpp
# scp -i ~/study/docs/vpp.pem -r dist ubuntu@13.55.73.184:~/vpp
scp -r dist vpp:/srv/www/vpp