import { useState, useEffect } from 'react'
import useWebSocket from 'react-use-websocket';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

import 'dayjs/locale/ru';
import './reset.css';
import { Button, Card, Flex, Form, Input, Space } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import axios from 'axios';

dayjs.locale('ru')


export const MainPage = () => {
  const [messages, setMessages] = useState([]);
  const [proxies, setProxies] = useState([]);
  const [config, setConfig] = useState({});
  const [settings, setSettings] = useState(false);
  const WS_URL = 'ws://localhost:8000'
  const API_URL = 'http://localhost:8000'
  const regex = /^http:\/\/([^:]+:[^@]+)@([^:]+:[^/]+)/

  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(
    WS_URL,
    {
      shouldReconnect: () => true
    }
  )

  const handlePause = () => {
    axios.put(API_URL + '/config/1', {
      ...config,
      pause: !config?.pause
    })
  }

  const handleChange = (values: any) => {
    axios.put(API_URL + '/config/1', {
      ...values,
      pause: config?.pause
    })
  }

  const handleChangeProxy = (values: any, id: number) => {
    axios.put(API_URL + `/proxies/${id}`, {
      proxy_id: values.proxy_id,
      url: `http://${values['login:password']}@${values['url:port']}`,
      change_ip: values.change_ip
    })
  }

  useEffect(() => {
    axios.get(API_URL + '/config').then((res) => {
      setConfig(res.data)
    })
      .catch((err) => console.log(err));
  }, [setConfig])

  useEffect(() => {
    axios.get(API_URL + '/proxies/').then((res) => {
      setProxies(res.data)
    })
      .catch((err) => console.log(err));
  }, [setProxies])


  useEffect(() => {
    console.log(lastJsonMessage)
    if (lastJsonMessage !== null) {
      setMessages((prev) => [...prev, lastJsonMessage])
    }
  }, [lastJsonMessage])

  return (
    <Flex style={{
      width: '100%',
      height: '100vh',
      backgroundColor: '#f5f5f5',
      padding: '30px 0 30px 30px'
    }} align='center' justify='space-around' vertical>
      <Card style={{ width: '90%', maxHeight: '70vh' }}>
        <Flex align='center' justify='space-around'>
          <span>Info: </span>
          <span>Количество кликов: 0/1800</span>
          {config.pause ? <Button onClick={handlePause} type='primary'>Возобновить работу</Button> : <Button onClick={handlePause} danger>Остановить работу</Button>}
          <Button onClick={() => setSettings((prev) => !prev)}><SettingOutlined /></Button>
        </Flex>
        {settings && (
          <Flex style={{ marginTop: 15 }} vertical gap='14px'>
            <Flex align='center' justify='center'>
              <Form onFinish={handleChange} name='config' layout='inline'>
                <Form.Item initialValue={config?.url} name='url' label='Ссылка'><Input /></Form.Item>
                <Form.Item initialValue={config?.api_key} name='api_key' label='Ключ API'><Input /></Form.Item>
                <Form.Item><Button htmlType='submit' type='primary'>Сохранить</Button></Form.Item>
              </Form>
            </Flex>
            <Flex align='center' justify='space-around'>
              <Form onFinish={(values) => handleChangeProxy(values, 1)} initialValues={{
                proxy_id: proxies[0].proxy_id,
                'url:port': proxies[0].url.match(regex)[1],
                'login:password': proxies[0].url.match(regex)[2],
                change_ip: proxies[0].change_ip
              }} name='proxy1'>
                <Form.Item name='proxy_id' label='Proxy id'>
                  <Input />
                </Form.Item>
                <Form.Item name='url:port' label='Адрес:Порт'>
                  <Input />
                </Form.Item>
                <Form.Item name='login:password' label="Логин:Пароль">
                  <Input />
                </Form.Item>
                <Form.Item name='change_ip' label="Смена IP">
                  <Input />
                </Form.Item>
                <Form.Item>
                  <Space>
                    <Button htmlType='submit'>Обновить</Button>
                    <Button>Удалить</Button>
                  </Space>
                </Form.Item>
              </Form>
              <Form onFinish={(values) => handleChangeProxy(values, 2)} initialValues={{
                proxy_id: proxies[1].proxy_id,
                'url:port': proxies[1].url.match(regex)[1],
                'login:password': proxies[1].url.match(regex)[2],
                change_ip: proxies[1].change_ip
              }} name='proxy2'>
                <Form.Item name='proxy_id' label='Proxy id'>
                  <Input />
                </Form.Item>
                <Form.Item name='url:port' label='Адрес:Порт'>
                  <Input />
                </Form.Item>
                <Form.Item name='login:password' label="Логин:Пароль">
                  <Input />
                </Form.Item>
                <Form.Item name='change_ip' label="Смена IP">
                  <Input />
                </Form.Item>
                <Form.Item>
                  <Space>
                    <Button htmlType='submit'>Обновить</Button>
                    <Button>Удалить</Button>
                  </Space>
                </Form.Item>
              </Form>
              <Form onFinish={(values) => handleChangeProxy(values, 3)} initialValues={{
                proxy_id: proxies[2].proxy_id,
                'url:port': proxies[2].url.match(regex)[1],
                'login:password': proxies[2].url.match(regex)[2],
                change_ip: proxies[2].change_ip
              }} name='proxy3'>
                <Form.Item name='proxy_id' label='Proxy id'>
                  <Input />
                </Form.Item>
                <Form.Item name='url:port' label='Адрес:Порт'>
                  <Input />
                </Form.Item>
                <Form.Item name='login:password' label="Логин:Пароль">
                  <Input />
                </Form.Item>
                <Form.Item name='change_ip' label="Смена IP">
                  <Input />
                </Form.Item>
                <Form.Item>
                  <Space>
                    <Button htmlType='submit'>Обновить</Button>
                    <Button>Удалить</Button>
                  </Space>
                </Form.Item>
              </Form>
              <Form onFinish={(values) => handleChangeProxy(values, 4)} initialValues={{
                proxy_id: proxies[3].proxy_id,
                'url:port': proxies[3].url.match(regex)[1],
                'login:password': proxies[3].url.match(regex)[2],
                change_ip: proxies[3].change_ip
              }} name='proxy4'>
                <Form.Item name='proxy_id' label='Proxy id'>
                  <Input />
                </Form.Item>
                <Form.Item name='url:port' label='Адрес:Порт'>
                  <Input />
                </Form.Item>
                <Form.Item name='login:password' label="Логин:Пароль">
                  <Input />
                </Form.Item>
                <Form.Item name='change_ip' label="Смена IP">
                  <Input />
                </Form.Item>
                <Form.Item>
                  <Space>
                    <Button htmlType='submit'>Обновить</Button>
                    <Button>Удалить</Button>
                  </Space>
                </Form.Item>
              </Form>
              <Form onFinish={(values) => handleChangeProxy(values, 5)} initialValues={{
                proxy_id: proxies[4].proxy_id,
                'url:port': proxies[4].url.match(regex)[1],
                'login:password': proxies[4].url.match(regex)[2],
                change_ip: proxies[4].change_ip
              }} name='proxy5'>
                <Form.Item name='proxy_id' label='Proxy id'>
                  <Input />
                </Form.Item>
                <Form.Item name='url:port' label='Адрес:Порт'>
                  <Input />
                </Form.Item>
                <Form.Item name='login:password' label="Логин:Пароль">
                  <Input />
                </Form.Item>
                <Form.Item name='change_ip' label="Смена IP">
                  <Input />
                </Form.Item>
                <Form.Item>
                  <Space>
                    <Button htmlType='submit'>Обновить</Button>
                    <Button>Удалить</Button>
                  </Space>
                </Form.Item>
              </Form>
            </Flex>
          </Flex>
        )
        }
      </Card>
      <Card style={{ width: '90%', height: '70vh' }}>
        {messages.map((message, idx) => (
          <div key={idx}>
            <p>Город - {message.city}, сделанно кликов - {message.clicks}/{message.allClicks} | {dayjs(message.time).locale('ru').format('DD/MM/YYYY HH:mm:ss')}</p>
          </div>
        ))}
      </Card>
    </Flex>
  )
}